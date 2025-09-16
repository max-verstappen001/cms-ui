import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  ExpandMore,
  Computer,
  Schedule,
  Person,
  SmartToy,
  CalendarToday,
  Key,
  AccessTime,
} from "@mui/icons-material";
import { clientAPI } from "../services/api";
import FileManager from "./FileManager";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getClientById(id);
      // Handle new backend response structure
      const clientData = response.data.client || response.data;
      setClient(clientData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch client details");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await clientAPI.deleteClient(id);
      navigate("/");
    } catch (err) {
      setError("Failed to delete client");
      console.error("Error:", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          Loading client details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!client) {
    return (
      <Alert severity='warning' sx={{ mb: 3 }}>
        Client not found
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='flex-start'
          flexWrap='wrap'
          gap={3}
        >
          <Box display='flex' alignItems='center' gap={3}>
            <IconButton
              onClick={() => navigate("/")}
              color='primary'
              size='large'
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Box display='flex' alignItems='center' gap={2} mb={1}>
                <Person color='primary' fontSize='large' />
                <Typography variant='h4' fontWeight={700}>
                  {client.client_name}
                </Typography>
                <Chip
                  label={client.status || "active"}
                  color='success'
                  variant='filled'
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Typography variant='subtitle1' color='text.secondary' mb={1}>
                Account ID: {client.account_id}
              </Typography>
              <Box display='flex' gap={3} mt={2}>
                <Box display='flex' alignItems='center' gap={1}>
                  <AccessTime fontSize='small' color='action' />
                  <Typography variant='body2' color='text.secondary'>
                    Created: {formatDate(client.createdAt)}
                  </Typography>
                </Box>
                <Box display='flex' alignItems='center' gap={1}>
                  <AccessTime fontSize='small' color='action' />
                  <Typography variant='body2' color='text.secondary'>
                    Updated: {formatDate(client.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display='flex' gap={2}>
            <Button
              variant='outlined'
              startIcon={<Edit />}
              onClick={() => navigate(`/edit/${client._id}`)}
              size='large'
            >
              Edit Client
            </Button>
            <Button
              variant='outlined'
              color='error'
              startIcon={<Delete />}
              onClick={() => setDeleteDialog(true)}
              size='large'
            >
              Delete Client
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Tabs for Different Sections */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ px: 3, pt: 2 }}
        >
          <Tab label='Client Information' />
          <Tab label='Knowledge Base' />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab Panel 0: Client Information */}
          {tabValue === 0 && (
            <Grid container spacing={4}>
              {/* AI Configuration */}
              <Grid item xs={12} lg={6}>
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display='flex' alignItems='center' gap={2} mb={3}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "primary.main",
                          color: "white",
                        }}
                      >
                        <Computer />
                      </Box>
                      <Box>
                        <Typography variant='h6' fontWeight={600}>
                          AI Configuration
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          OpenAI settings and parameters
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ mb: 3 }}>
                        <Box
                          display='flex'
                          alignItems='center'
                          justifyContent='space-between'
                          mb={1}
                        >
                          <Typography variant='subtitle2' fontWeight={600}>
                            OpenAI Model
                          </Typography>
                          <Chip
                            label={client.openai_ai_model}
                            variant='filled'
                            size='small'
                            color='primary'
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            display='block'
                          >
                            Temperature
                          </Typography>
                          <Typography
                            variant='h6'
                            fontWeight={600}
                            color='primary.main'
                          >
                            {client.temperature}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            display='block'
                          >
                            Max Tokens
                          </Typography>
                          <Typography
                            variant='h6'
                            fontWeight={600}
                            color='primary.main'
                          >
                            {client.max_response_tokens}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box display='flex' alignItems='center' gap={1}>
                          <Key fontSize='small' color='action' />
                          <Typography variant='subtitle2' fontWeight={500}>
                            OpenAI API Key
                          </Typography>
                        </Box>
                        <Chip
                          label={
                            client.openai_api_key ? "Configured" : "Not Set"
                          }
                          color={client.openai_api_key ? "success" : "error"}
                          variant='filled'
                          size='small'
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box display='flex' alignItems='center' gap={1}>
                          <Key fontSize='small' color='action' />
                          <Typography variant='subtitle2' fontWeight={500}>
                            Bot API Key
                          </Typography>
                        </Box>
                        <Chip
                          label={client.bot_api_key ? "Configured" : "Not Set"}
                          color={client.bot_api_key ? "success" : "error"}
                          variant='filled'
                          size='small'
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box display='flex' alignItems='center' gap={1}>
                          <Key fontSize='small' color='action' />
                          <Typography variant='subtitle2' fontWeight={500}>
                            General API Key
                          </Typography>
                        </Box>
                        <Chip
                          label={client.api_key ? "Configured" : "Not Set"}
                          color={client.api_key ? "success" : "error"}
                          variant='filled'
                          size='small'
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Calendar & Settings */}
              <Grid item xs={12} lg={6}>
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display='flex' alignItems='center' gap={2} mb={3}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "info.main",
                          color: "white",
                        }}
                      >
                        <CalendarToday />
                      </Box>
                      <Box>
                        <Typography variant='h6' fontWeight={600}>
                          Calendar & Settings
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Time zone and calendar configuration
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          display='block'
                          mb={1}
                        >
                          Calendar ID
                        </Typography>
                        <Typography
                          variant='body2'
                          fontWeight={500}
                          sx={{ wordBreak: "break-all" }}
                        >
                          {client.calendar_id || "Not configured"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            display='block'
                          >
                            Time Zone
                          </Typography>
                          <Typography
                            variant='h6'
                            fontWeight={600}
                            color='info.main'
                          >
                            {client.time_zone}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            display='block'
                          >
                            Reminder (min)
                          </Typography>
                          <Typography
                            variant='h6'
                            fontWeight={600}
                            color='info.main'
                          >
                            {client.reminder_min}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* System Prompts */}
              <Grid item xs={12}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display='flex' alignItems='center' gap={2} mb={3}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "warning.main",
                          color: "white",
                        }}
                      >
                        <SmartToy />
                      </Box>
                      <Box>
                        <Typography variant='h6' fontWeight={600}>
                          System Prompts
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          AI behavior and response configuration
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Accordion
                          sx={{
                            borderRadius: 2,
                            "&:before": { display: "none" },
                            boxShadow: 1,
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant='subtitle2' fontWeight={600}>
                              Default System Prompt
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Paper
                              variant='outlined'
                              sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}
                            >
                              <Typography
                                variant='body2'
                                style={{ whiteSpace: "pre-wrap" }}
                              >
                                {client.system_prompt_defult}
                              </Typography>
                            </Paper>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Accordion
                          sx={{
                            borderRadius: 2,
                            "&:before": { display: "none" },
                            boxShadow: 1,
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant='subtitle2' fontWeight={600}>
                              Attributes System Prompt
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Paper
                              variant='outlined'
                              sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}
                            >
                              <Typography
                                variant='body2'
                                style={{ whiteSpace: "pre-wrap" }}
                              >
                                {client.system_prompt_attributes}
                              </Typography>
                            </Paper>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Accordion
                          sx={{
                            borderRadius: 2,
                            "&:before": { display: "none" },
                            boxShadow: 1,
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant='subtitle2' fontWeight={600}>
                              Lead Classification System Prompt
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Paper
                              variant='outlined'
                              sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}
                            >
                              <Typography
                                variant='body2'
                                style={{ whiteSpace: "pre-wrap" }}
                              >
                                {client.system_prompt_lead_classification}
                              </Typography>
                            </Paper>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box display='flex' justifyContent='center' mt={2}>
                  <Button
                    variant='outlined'
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/")}
                    size='large'
                  >
                    Back to Client List
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* Tab Panel 1: Knowledge Base */}
          {tabValue === 1 && (
            <FileManager
              accountId={client?.account_id}
              clientName={client?.client_name}
            />
          )}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Are you sure you want to delete the client "{client.client_name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color='inherit'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientDetails;
