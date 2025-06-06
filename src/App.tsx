import { Typography, Box, Container } from "@mui/material";
import MapBox from "./components/Map";

function App() {
  return (
    <Container maxWidth={false} sx={{ height: '100vh', p: 2 }}>
      <Typography variant="h2" align="center" sx={{ mb: 3 }}>
        Weather Box
      </Typography>
      <Box sx={{ height: 'calc(100% - 100px)' }}>
        <MapBox />
      </Box>
    </Container>
  );
}

export default App;
