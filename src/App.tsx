import { Typography, Box, Container } from "@mui/material";
import Grid from '@mui/material/Grid';
import MapBox from "./components/Map";
import WeatherDisplay from "./components/WeatherDisplay";

function App() {
  return (
    <Container maxWidth={false} sx={{ height: '100vh', p: 2 }}>
      <Typography variant="h2" align="center" sx={{ mb: 3 }}>
        Weather Box
      </Typography>
      <Grid container spacing={3} direction="column">
        <Grid size={{ xs: 12 }}>
          <WeatherDisplay />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ height: 'calc(100vh - 350px)' }}>
            <MapBox />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
