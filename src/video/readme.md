#   RTCDataChannel
##  RTCDataChannel可以建立浏览器之间的点对点通讯。常用的通讯方式有webSocket, ajax和 Server Sent Events等方式，websocket虽然是双向通讯，但是无论是websocket还是ajax都是客户端和服务器之间的通讯，这就意味着你必须配置服务器才可以进行通讯。而RTCDATAChannel采用另外一种实现方式

### 它使用webRTC的另外一个API：RTCPeerConnection，RTCPeerConnection无需经过服务器就可以提供点对点之间的通讯，避免服务器这个中间件RTCDataChannel支持SCTP机制，SCTP实际上是一个面向连接的协议，但SCTP偶联的概念要比TCP的连接具有更广的概念，SCTP对TCP的缺陷进行了一些完善,使得信令传输具有更高的可靠性，SCTP的设计包括适当的拥塞控制、防止泛滥和伪装攻击、更优的实时性能和多归属性支持

### ICE
交互式连接建立(ICE)是一个允许你的网页浏览器与其他浏览器连接的框架。有很多原因可以解释为什么从对等点 A 到对等点 B 的直接连接不起作用。它需要绕过防火墙来阻止连接的打开，在大多数情况下，如果你的设备没有公共 IP 地址，它需要给你一个唯一的地址，如果你的路由器不允许你直接连接到对等网络，它需要通过服务器传输数据。ICE 使用 STUN 和/或 TURN 服务器来实现这一点，如下所述。

### STUN
NAT 的会话穿越功能Session Traversal Utilities for NAT (STUN) (缩略语的最后一个字母是 NAT 的首字母) 是一个允许位于 NAT 后的客户端找出自己的公网地址，判断出路由器阻止直连的限制方法的协议。
客户端通过给公网的 STUN 服务器发送请求获得自己的公网地址信息，以及是否能够被（穿过路由器）访问

### NAT
网络地址转换协议Network Address Translation (NAT) 用来给你的（私网）设备映射一个公网的 IP 地址的协议。一般情况下，路由器的 WAN 口有一个公网 IP，所有连接这个路由器 LAN 口的设备会分配一个私有网段的 IP 地址（例如 192.168.1.3）。私网设备的 IP 被映射成路由器的公网 IP 和唯一的端口，通过这种方式不需要为每一个私网设备分配不同的公网 IP，但是依然能被外网设备发现。

一些路由器严格地限定了谁能连接内网的设备。这种情况下，即使 STUN 服务器识别了该内网设备的公网 IP 和端口的映射，依然无法和这个内网设备建立连接。这种情况下就需要转向 TURN 协议。

### TURN
一些路由器使用一种“对称型 NAT”的 NAT 模型。这意味着路由器只接受和对端先前建立的连接（就是下一次请求建立新的连接映射）。

NAT 的中继穿越方式Traversal Using Relays around NAT (TURN) 通过 TURN 服务器中继所有数据的方式来绕过“对称型 NAT”。你需要在 TURN 服务器上创建一个连接，然后告诉所有对端设备发包到服务器上，TURN 服务器再把包转发给你。很显然这种方式是开销很大的，所以只有在没得选择的情况下采用。


### SDP
会话描述协议Session Description Protocol (SDP) 是一个描述多媒体连接内容的协议，例如分辨率，格式，编码，加密算法等。所以在数据传输时两端都能够理解彼此的数据。本质上，这些描述内容的元数据并不是媒体流本身。

从技术上讲，SDP 并不是一个真正的协议，而是一种数据格式，用于描述在设备之间共享媒体的连接。

记录 SDP 远远超出了本文档的范围。但是，这里有几件事值得注意。


### Signal（信令） Channel（通道）  信令服务器
在建立连接之前交换信息的任何形式的沟通渠道，无论是通过电子邮件、明信片还是信鸽。
两个设备之间建立 WebRTC 连接需要一个信令服务器来实现双方通过网络进行连接。信令服务器的作用是作为一个中间人帮助双方在尽可能少的暴露隐私的情况下建立连接

### ICE candidates（ICE 候选人）
除了交换有关媒体的信息(在上面的提供/应答和 SDP 中讨论过) ，对等方还必须交换有关网络连接的信息。这被称为 ICE 候选人和详细的可用方法，对等能够通信(直接或通过一个 TURN 服务器)。通常情况下，每个同行都会首先提出自己最好的候选人，从而逐渐接近自己最差的候选人。理想情况下，候选者是 UDP (因为它更快，并且媒体流能够相对容易地从中断恢复) ，但是 ICE 标准也允许 TCP 候选者。
注意: 一般来说，使用 TCP 的 ICE 候选者只会在 UDP 不可用或者受到限制以致不适合于媒体流的情况下使用。然而，并非所有浏览器都支持基于 TCP 的 ICE。
ICE 允许候选人通过 TCP 或 UDP 表示连接，UDP 通常是首选(并得到更广泛的支持)。每个协议支持几种候选类型，候选类型定义了数据如何从一个对等点传输到另一个对等点。





### 步骤
提供/应答过程在呼叫首次建立时执行，也在呼叫格式或其他配置需要更改时执行。无论是一个新的电话，还是重新配置一个现有的电话，这些是必须发生的基本步骤，以交换提供和答复，暂时不考虑 ICE 层:

调用者通过 MediaDevices.getUserMedia 捕获本地 Media
调用方创建 RTCPeerConnection 并调用 RTCPeerConnection.addTrack ()(因为 addStream 不赞成)
调用方调用 RTCPeerConnection.createOffer ()来创建报价。
调用方调用 RTCPeerConnection.setLocalDescription ()将该提供设置为本地描述(即连接的本地端的描述)。
在 setLocalDescription ()之后，调用方请求 STUN 服务器生成冰候选项
呼叫方使用信令服务器将报价传输给呼叫的预期接收方。
收件人接收到提议并调用 RTCPeerConnection.setRemoteDescription ()将其记录为远程描述(连接的另一端的描述)。
接收方为其呼叫结束进行所需的任何设置: 捕获其本地媒体，并通过 RTCPeerConnection.addTrack ()将每个媒体轨道附加到对等连接中
然后，收件人通过调用 RTCPeerConnection.createResponse ()创建一个应答。
收件人调用 RTCPeerConnection.setLocalDescription () ，传递创建的答案，以将答案设置为其本地描述。收件人现在知道连接两端的配置。
接收方使用信令服务器向调用方发送应答。
呼叫者接收到应答。
调用方调用 RTCPeerConnection.setRemoteDescription ()将应答设置为调用结束的远程描述。它现在知道两个对等点的配置。媒体开始按照配置流动。



### Stream Videos with WebRTC API and React
### https://cloudinary.com/blog/guest_post/stream-videos-with-webrtc-api-and-react