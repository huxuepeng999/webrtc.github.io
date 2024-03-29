import './App.css';
import Home from './home/Home';
import Notifications from './components/Notifications'
import Options from './components/Options'
import VideoPlayer from './components/VideoPlayer'
import { Box, Heading, Container } from '@chakra-ui/react';

function App() {
  return (
    <Box>
        <Container maxW={1200} mt={8}>
            {/* <Heading as="h2" size="2xl">video chart app</Heading>
            <VideoPlayer></VideoPlayer>
            <Options></Options>
            <Notifications></Notifications> */}
        </Container>
    </Box>
  );
}

export default App;
