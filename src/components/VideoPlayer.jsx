import { Grid, Box, Heading } from "@chakra-ui/react"
import { SocketContext } from "../Context"
import { useContext } from "react"

const VideoPlayer = () => {

    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext)

    console.log('res===VideoPlayer', callAccepted);

    return (
        <Grid justifyContent="center" templateColumns='repeat(2, 1fr)' mt='12'>
            {/* my video */}
            {
                stream && (
                    <Box>
                        <Grid colSpan={1}>
                            <Heading as="h5">
                                {name || 'Name'}
                            </Heading>
                            <video playsInline muted ref={myVideo} autoPlay width='600'></video>
                        </Grid>
                    </Box>
                )
            }
            {/* user's video */}
            {
                callAccepted && !callEnded && (
                    <Box>
                        <Grid colSpan={1}>
                            <Heading as='h5'>{call.name || 'Name'}</Heading>
                        </Grid>
                        <video playsInline ref={userVideo} autoPlay width='600'></video>
                    </Box>
                )
            }
        </Grid>
    )
}

export default VideoPlayer