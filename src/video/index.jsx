
import React, { useEffect } from 'react'
import Notifications from '../components/Notifications'
import Options from '../components/Options'
import VideoPlayer from '../components/VideoPlayer'
import { Box, Heading, Container } from '@chakra-ui/react';
import { ContextProvider } from '../Context';

const WebVideo = () => {

    useEffect(() => {
        var constraints = { audio: true, video: { width: 1280, height: 720 } };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function (mediaStream) {
                console.log(mediaStream);
                var video = document.querySelector("video");
                video.srcObject = mediaStream;
                video.onloadedmetadata = function (e) {
                    video.play();
                };
            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            }); // 总是在最后检查错误
    }, [])

    return (
        <div>
            <ContextProvider>
                <Heading as="h2" size="2xl">video chart app</Heading>
                <VideoPlayer></VideoPlayer>
                <Options></Options>
                <Notifications></Notifications>
                <div>WebVideo</div>
            </ContextProvider>
        </div>
    )
}

export default WebVideo