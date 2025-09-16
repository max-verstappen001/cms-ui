import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { Home, PersonAdd, Logout } from "@mui/icons-material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ClientList from "./components/clientList.jsx";
import ClientForm from "./components/clientForm.jsx";
import ClientDetails from "./components/clientDetails.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Don't show navigation on login page
  if (location.pathname === '/login' || !isAuthenticated) {
    return null;
  }

  return (
    <AppBar position='static' sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Client Management System
        </Typography>
        {user && (
          <Typography variant='body2' sx={{ mr: 2, opacity: 0.9 }}>
            Welcome, {user.username || user.name}
          </Typography>
        )}
        <Button
          color='inherit'
          startIcon={<Home />}
          onClick={() => navigate("/")}
          sx={{ mr: 2 }}
        >
          All Clients
        </Button>
        <Button
          color='inherit'
          startIcon={<PersonAdd />}
          onClick={() => navigate("/create")}
          sx={{ mr: 2 }}
        >
          Add Client
        </Button>
        <Button
          color='inherit'
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ flexGrow: 1 }}>
            <Navigation />
            <Container maxWidth='lg'>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route 
                  path='/' 
                  element={
                    <ProtectedRoute>
                      <ClientList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path='/create' 
                  element={
                    <ProtectedRoute>
                      <ClientForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path='/edit/:id' 
                  element={
                    <ProtectedRoute>
                      <ClientForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path='/client/:id' 
                  element={
                    <ProtectedRoute>
                      <ClientDetails />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Container>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
