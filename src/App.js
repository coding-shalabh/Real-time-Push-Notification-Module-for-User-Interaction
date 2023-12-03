import './App.css';
import './CommonStyles.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './Components/Home';
import { AuthProvider } from './Context/AuthContext';
import DashboardUser from './Components/DashboardUser';
import DashboardAdmin from './Components/DashboardAdmin';
import Login from './Components/Login';


const theme = createTheme({
  palette: {
      white: '#fff',
      black: '#000',
      orange: 'orange',
      blue: 'blue',
  },
});

function App() {
  return (
    <AuthProvider>
    <ThemeProvider theme={theme}>
    <Box sx={{background:'orange', width: '100%', height: '100vh'}} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/DashboardUser' element={<DashboardUser/>} />
        <Route path='/DashboardAdmin' element={<DashboardAdmin/>} />
        <Route path='/Login' element={<Login/>} />
        <Route path='*' element={<Home/>} />

      </Routes>
    </BrowserRouter>
    </Box>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
