import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Chip,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  CardActions,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Edit,
  Delete,
  Visibility,
  PersonAdd,
  Settings,
  Schedule,
  Computer,
} from "@mui/icons-material";
import { clientAPI } from "../services/api";

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    clientId: null,
    clientName: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAllClients();
      // Updated to handle new backend response structure
      const clientsData = response.data.clients || response.data;
      setClients(clientsData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch clients");
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (clientId, clientName) => {
    setDeleteDialog({ open: true, clientId, clientName });
  };

  const handleDeleteConfirm = async () => {
    try {
      await clientAPI.deleteClient(deleteDialog.clientId);
      setClients(
        clients.filter((client) => client._id !== deleteDialog.clientId)
      );
      setDeleteDialog({ open: false, clientId: null, clientName: "" });
    } catch (err) {
      setError("Failed to delete client");
      console.error("Error deleting client:", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, clientId: null, clientName: "" });
  };

  const filteredClients = clients.filter(
    (client) =>
      client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.account_id.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='400px'
      >
        <CircularProgress size={60} />
        <Typography variant='h6' sx={{ ml: 2 }}>
          Loading clients...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='h4' component='h1'>
            Client Management
          </Typography>
          <Button
            variant='contained'
            startIcon={<PersonAdd />}
            onClick={() => navigate("/create")}
            size='large'
          >
            Add New Client
          </Button>
        </Box>

        <TextField
          fullWidth
          variant='outlined'
          placeholder='Search clients by name or account ID...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600 }}
        />
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* No Clients Found */}
      {filteredClients.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: "center" }}>
          <Typography variant='h6' gutterBottom>
            {clients.length === 0
              ? "No clients found"
              : "No matching clients found"}
          </Typography>
          <Typography variant='body1' color='text.secondary' gutterBottom>
            {clients.length === 0
              ? "Get started by adding your first client"
              : "Try adjusting your search criteria"}
          </Typography>
          {clients.length === 0 && (
            <Button
              variant='contained'
              startIcon={<PersonAdd />}
              onClick={() => navigate("/create")}
              sx={{ mt: 2 }}
            >
              Add First Client
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {/* Client Stats */}
          <Box sx={{ mb: 3 }}>
            <Typography variant='body1' color='text.secondary'>
              Showing {filteredClients.length} of {clients.length} clients
            </Typography>
          </Box>

          {/* Clients Grid */}
          <Grid container spacing={3}>
            {filteredClients.map((client) => (
              <Grid item xs={12} sm={6} lg={4} key={client._id}>
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      elevation: 6,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Client Header */}
                    <Box
                      display='flex'
                      justifyContent='space-between'
                      alignItems='flex-start'
                      mb={2}
                    >
                      <Typography
                        variant='h6'
                        component='h2'
                        noWrap
                        sx={{ flexGrow: 1, mr: 1 }}
                      >
                        {client.client_name}
                      </Typography>
                      <Chip
                        label={client.status}
                        color={client.status === "active" ? "success" : "error"}
                        size='small'
                      />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Client Information */}
                    <Box sx={{ mb: 2 }}>
                      <Box display='flex' alignItems='center' mb={1}>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ minWidth: 100 }}
                        >
                          Account ID:
                        </Typography>
                        <Typography variant='body2' fontWeight='medium'>
                          {client.account_id}
                        </Typography>
                      </Box>

                      <Box display='flex' alignItems='center' mb={1}>
                        <Computer
                          fontSize='small'
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ minWidth: 80 }}
                        >
                          Model:
                        </Typography>
                        <Typography variant='body2' fontWeight='medium'>
                          {client.openai_ai_model}
                        </Typography>
                      </Box>

                      <Box display='flex' alignItems='center' mb={1}>
                        <Settings
                          fontSize='small'
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ minWidth: 80 }}
                        >
                          Temp:
                        </Typography>
                        <Typography variant='body2' fontWeight='medium'>
                          {client.temperature}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ ml: 2, minWidth: 80 }}
                        >
                          Tokens:
                        </Typography>
                        <Typography variant='body2' fontWeight='medium'>
                          {client.max_response_tokens}
                        </Typography>
                      </Box>

                      <Box display='flex' alignItems='center'>
                        <Schedule
                          fontSize='small'
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ minWidth: 80 }}
                        >
                          Timezone:
                        </Typography>
                        <Typography variant='body2' fontWeight='medium'>
                          {client.time_zone}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Box display='flex' gap={1} width='100%'>
                      <Tooltip title='View Details'>
                        <IconButton
                          size='small'
                          onClick={() => navigate(`/client/${client._id}`)}
                          color='info'
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title='Edit Client'>
                        <IconButton
                          size='small'
                          onClick={() => navigate(`/edit/${client._id}`)}
                          color='primary'
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title='Delete Client'>
                        <IconButton
                          size='small'
                          onClick={() =>
                            handleDeleteClick(client._id, client.client_name)
                          }
                          color='error'
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>

                      <Button
                        variant='outlined'
                        size='small'
                        onClick={() => navigate(`/client/${client._id}`)}
                        sx={{ ml: "auto" }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Are you sure you want to delete the client "
            {deleteDialog.clientName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color='error'
            variant='contained'
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientList;
