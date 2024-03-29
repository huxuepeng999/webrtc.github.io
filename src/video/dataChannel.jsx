import React, { useState, useEffect, useRef } from 'react'

const DataChannel = () => {

    const [value, setValue] = useState('')
    const [send, setSend] = useState('')
    const [receives, setReceives] = useState([])
    const localConnection = useRef(); // RTCPeerConnection for our "local" connection
    const remoteConnection = useRef(); // RTCPeerConnection for the "remote"

    const sendChannel = useRef(); // RTCDataChannel for the local (sender)
    const receiveChannel = useRef(); // RTCDataChannel for the remote (receiver)

    function handleSendChannelStatusChange(event) {
        console.log('res===sendChannel', sendChannel.current);
        if (sendChannel.current) {
            const state = sendChannel.current.readyState;

            if (state === "open") {
                // messageInputBox.focus();
            } else {
            }
        }
    }

    function receiveChannelCallback(event) {
        console.log('res===receiveChannelCallback', event);
        receiveChannel.current = event.channel;
        receiveChannel.current.onmessage = handleReceiveMessage;
        receiveChannel.current.onopen = handleReceiveChannelStatusChange;
        receiveChannel.current.onclose = handleReceiveChannelStatusChange;
    }

    function handleReceiveMessage(event) {
        console.log('res===handleReceiveMessage', event);   //  event.data
        const datas = receives.concat(event.data)
        setReceives(datas)
    }

    function handleReceiveChannelStatusChange(event) {
        console.log('res===handleReceiveChannelStatusChange', event);
        if (receiveChannel.current) {
            console.log(`res===Receive channel's status has changed to ${receiveChannel.current.readyState}`);
        }
    }

    function handleCreateDescriptionError(error) {
        console.log(`res===Unable to create an offer: ${error.toString()}`);
    }

    function handleLocalAddCandidateSuccess() {
        // connectButton.disabled = true;
    }

    function handleRemoteAddCandidateSuccess() {
        // disconnectButton.disabled = false;
    }

    function handleAddCandidateError() {
        console.log("res===Oh noes! addICECandidate failed!");
    }

    const onConnect = () => {
        // 1.创建连接的本地端。这是发送连接请求的对等端。
        // 2.通过调用 RTCPeerConnection.createDataChannel() 来创建 RTCD 数据通道，并设置事件监听器来监控通道，
        // 这样我们就能知道通道何时打开和关闭（即通道何时在该对等连接中连接或断开）
        localConnection.current = new RTCPeerConnection()
        sendChannel.current = localConnection.current.createDataChannel('sendChannel')
        console.log('res===1', localConnection.current, sendChannel.current);
        sendChannel.current.onopen = handleSendChannelStatusChange
        sendChannel.current.onclose = handleSendChannelStatusChange
        // 3.远端设置与此类似，只是我们不需要自己明确创建 RTCDataChannel，
        //  因为我们将通过上面建立的通道进行连接。取而代之的是，我们设置了一个数据通道事件处理程序；
        //  当数据通道被打开时，该处理程序将被调用；该处理程序将接收一个 RTCDataChannel 对象；您将在下面看到该处理程序
        remoteConnection.current = new RTCPeerConnection();
        remoteConnection.current.ondatachannel = receiveChannelCallback;
        // 4.为每个连接设置 ICE 候选监听器；当有新的 ICE 候选监听器要告诉对方时，这些监听器就会被调用。
        localConnection.current.onicecandidate = (e) => {
            console.log('res===1 onicecandidate'. e);
            return !e.candidate || remoteConnection.current.addIceCandidate(e.candidate).catch(handleAddCandidateError);
        }
        remoteConnection.current.onicecandidate = (e) => {
            console.log('res===2 onicecandidate'. e);
            return !e.candidate || localConnection.current.addIceCandidate(e.candidate).catch(handleAddCandidateError);
        }
        // 5.为了开始连接我们的同行，我们需要做的最后一件事就是创建一个连接提议。
        localConnection.current
            .createOffer()  /**create an SDP  */
            .then((offer) => localConnection.current.setLocalDescription(offer))
            .then(() => remoteConnection.current.setRemoteDescription(localConnection.current.localDescription))
            .then(() => remoteConnection.current.createAnswer())
            .then((answer) => remoteConnection.current.setLocalDescription(answer))
            .then(() => localConnection.current.setRemoteDescription(remoteConnection.current.localDescription))
            .catch(handleCreateDescriptionError);
    }
    const onDisconnect = () => {
        sendChannel.current.close();
        receiveChannel.current.close();

        // Close the RTCPeerConnections

        localConnection.current.close();
        remoteConnection.current.close();

        sendChannel.current = null;
        receiveChannel.current = null;
        localConnection.current = null;
        remoteConnection.current = null;
    }

    const onSend = () => {
        console.log('res===onSend', value);
        sendChannel.current.send(value);
        setValue('');
    }

    const onTest1 = () => {
        const datas = receives.concat(value)
        console.log('res===datas1', datas);
        setReceives(datas)
    }

    const onChangeInput = (event) => {
        setValue(event.target.value)
    }

    return (
        <div>
            <button onClick={onConnect}>Connect</button>
            <button onClick={onDisconnect}>disconnect</button>
            <div className="messagebox">
                <label>Enter a message:
                    <input
                        type="text"
                        name="message"
                        id="message"
                        value={value}
                        onChange={onChangeInput}
                        placeholder="Message text"
                        size="60" />
                </label>
                <button id="sendButton" name="sendButton"
                    onClick={onSend}
                >Send</button>
                <button id="onTest1" name="onTest1"
                    onClick={onTest1}
                >onTest1</button>
            </div>
            <div className="messagebox" id="receivebox">
                <p>Messages received:</p>
                {
                    receives.map((item, index) => {
                        return (
                            <p key={index}>{item}</p>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default DataChannel



// 1.我们调用 RTCPeerConnection.createOffer() 方法创建一个 SDP（会话描述协议）blob，描述我们要建立的连接。该方法可选择接受一个对象，其中包含为满足连接需要而必须满足的约束条件，如连接是否应支持音频、视频或两者。在我们的简单示例中，我们没有任何约束条件。
// 2.如果提议创建成功，我们会将 Blob 传递给本地连接的 RTCPeerConnection.setLocalDescription() 方法。
// 3.下一步是将本地对等体连接到远程对等体，并将其告知远程对等体。这可以通过调用 remoteConnection.RTCPeerConnection.setRemoteDescription() 来完成。现在，remoteConnection 知道了正在建立的连接。在实际应用中，这需要信令服务器交换描述对象。
// 4.这意味着远端对等设备该回复了，它可以调用 createAnswer() 方法来回复。这将生成一个 SDP 数据块，描述远程对等设备愿意并能够建立的连接。
// 5.一旦创建了应答，就会通过调用 RTCPeerConnection.setLocalDescription() 将其传入远程连接。这样就建立了连接的远程端（对于远程对等端来说，这就是它的本地端）。这些东西可能会让人困惑，但慢慢就会习惯）。
// 6.调用 localConnection 的 RTCPeerConnection.setRemoteDescription()，将本地连接的远程描述设置为指向远程对等设备
// 7.catch() 调用一个例程来处理出现的任何错误
// 注：再次说明，此过程并非真实世界中的实现；在正常使用中，有两段代码在两台机器上运行，进行交互并协商连接。通常使用一个侧信道（通常称为 "信令服务器"）在两个对等机之间交换描述（应用/sdp 格式）。