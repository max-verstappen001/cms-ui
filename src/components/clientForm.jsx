import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from "@mui/material";
import {
  Save,
  Cancel,
  Edit,
  Add,
  ExpandMore,
  Person,
  Computer,
  Schedule,
  SmartToy,
  Security,
} from "@mui/icons-material";
import { clientAPI } from "../services/api";
import {time_zones} from "../utils/timeZone";

const gptList = [
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-5-turbo", label: "GPT-5 Turbo" },
  { value: "gpt-5o", label: "GPT-5o" },
  { value: "gpt-5o-mini", label: "GPT-5o Mini" },
  { value: "gpt-5", label: "GPT-5" },
];

const ClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    account_id: "",
    client_name: "",
    bot_api_key: "",
    api_key: "",
    system_prompt_defult: "You are a helpful assistant.",
    system_prompt_attributes: "You are a helpful assistant.",
    system_prompt_lead_classification: "You are a helpful assistant.",
    system_prompt_followup:  "You are a helpful assistant.",
    system_prompt_appointment_schedule:  "You are a helpful assistant.",
    max_response_tokens: 500,
    temperature: 0.7,
    calendar_id: "",
    time_zone: "UTC",
    openai_api_key: "",
    openai_ai_model: "gpt-3.5-turbo",
    reminder_min: 30,
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getClientById(id);
      // Handle new backend response structure
      const clientData = response.data.client || response.data;
      setFormData(clientData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch client data");
      console.error("Error fetching client:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await clientAPI.updateClient(id, formData);
      } else {
        await clientAPI.createClient(formData);
      }

      navigate("/");
    } catch (err) {
      setError(
        isEditing ? "Failed to update client" : "Failed to create client"
      );
      console.error("Error saving client:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='400px'
      >
        <CircularProgress size={60} />
        <Typography variant='h6' sx={{ ml: 2 }}>
          Loading client data...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Stack direction='row' spacing={3} alignItems='center'>
            {isEditing ? (
              <Edit sx={{ fontSize: 40, color: "warning.main" }} />
            ) : (
              <Add sx={{ fontSize: 40, color: "success.main" }} />
            )}
            <Box>
              <Typography
                variant='h3'
                component='h1'
                fontWeight='600'
                gutterBottom
              >
                {isEditing ? "Edit Client" : "Create New Client"}
              </Typography>
              <Typography variant='subtitle1' color='text.secondary'>
                {isEditing
                  ? "Update client information and configuration"
                  : "Set up a new client with AI and calendar settings"}
              </Typography>
            </Box>
            <Box sx={{ ml: "auto" }}>
              <Chip
                label={isEditing ? "Edit Mode" : "Create Mode"}
                color={isEditing ? "warning" : "success"}
                variant='filled'
                size='large'
                sx={{ fontWeight: "bold" }}
              />
            </Box>
          </Stack>
        </Paper>

        {error && (
          <Alert severity='error' sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component='form' onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Basic Information */}
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction='row' spacing={2} alignItems='center' mb={3}>
                  <Person color='primary' sx={{ fontSize: 28 }} />
                  <Typography variant='h5' fontWeight='600'>
                    Basic Information
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Account ID'
                      name='account_id'
                      type='number'
                      value={formData.account_id}
                      onChange={handleChange}
                      required
                      disabled={isEditing}
                      helperText={
                        isEditing
                          ? "Account ID cannot be changed"
                          : "Unique identifier for the client"
                      }
                      variant='outlined'
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Client Name'
                      name='client_name'
                      value={formData.client_name}
                      onChange={handleChange}
                      required
                      variant='outlined'
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* System Prompts */}
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction='row' spacing={2} alignItems='center' mb={3}>
                  <SmartToy color='primary' sx={{ fontSize: 28 }} />
                  <Typography variant='h5' fontWeight='600'>
                    System Prompts
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant='h6'>
                        Default System Prompt
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name='system_prompt_defult'
                        value={formData.system_prompt_defult}
                        onChange={handleChange}
                        placeholder='Enter the default system prompt...'
                        variant='outlined'
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant='h6'>
                        Attributes System Prompt
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name='system_prompt_attributes'
                        value={formData.system_prompt_attributes}
                        onChange={handleChange}
                        placeholder='Enter the attributes system prompt...'
                        variant='outlined'
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant='h6'>
                        Lead Classification System Prompt
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name='system_prompt_lead_classification'
                        value={formData.system_prompt_lead_classification}
                        onChange={handleChange}
                        placeholder='Enter the lead classification system prompt...'
                        variant='outlined'
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    </AccordionDetails>
                  </Accordion>

                  {/* Schedule Prompt*/}
                   <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant='h6'>
                        Appointment Schedule System Prompt
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name='system_prompt_appointment_schedule'
                        value={formData.system_prompt_appointment_schedule}
                        onChange={handleChange}
                        placeholder='Enter the appointment schedule system prompt...'
                        variant='outlined'
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    </AccordionDetails>
                  </Accordion>

                   {/*  Prompt*/}
                   <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant='h6'>
                        Follow-up System Prompt
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name='system_prompt_followup'
                        value={formData.system_prompt_followup}
                        onChange={handleChange}
                        placeholder='Enter the follow up system prompt...'
                        variant='outlined'
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </CardContent>
            </Card>

            {/* AI Configuration */}
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction='row' spacing={2} alignItems='center' mb={3}>
                  <Computer color='primary' sx={{ fontSize: 28 }} />
                  <Typography variant='h5' fontWeight='600'>
                    AI Configuration
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label='Max Response Tokens'
                      name='max_response_tokens'
                      type='number'
                      value={formData.max_response_tokens}
                      onChange={handleChange}
                      inputProps={{ min: 1, max: 4000 }}
                      variant='outlined'
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label='Temperature'
                      name='temperature'
                      type='number'
                      value={formData.temperature}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 2, step: 0.1 }}
                      variant='outlined'
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>OpenAI Model</InputLabel>
                      <Select
                        name='openai_ai_model'
                        value={formData.openai_ai_model}
                        onChange={handleChange}
                        label='OpenAI Model'
                        sx={{ borderRadius: 2 }}
                      >
                        {gptList.map((model) => (
                          <MenuItem key={model.value} value={model.value}>
                            {model.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='OpenAI API Key'
                      name='openai_api_key'
                      type='password'
                      value={formData.openai_api_key}
                      onChange={handleChange}
                      placeholder='sk-...'
                      helperText='Your OpenAI API key will be encrypted and stored securely'
                      variant='outlined'
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Bot API Key'
                      name='bot_api_key'
                      type='password'
                      value={formData.bot_api_key}
                      onChange={handleChange}
                      placeholder='bot_...'
                      helperText='Bot API key will be encrypted before transmission and storage'
                      variant='outlined'
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='General API Key'
                      name='api_key'
                      type='password'
                      value={formData.api_key}
                      onChange={handleChange}
                      placeholder='api_...'
                      helperText='General API key will be encrypted before transmission and storage'
                      variant='outlined'
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Alert
              icon={<Security />}
              severity='info'
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "info.main",
                backgroundColor: "info.light",
                "& .MuiAlert-icon": { color: "info.main" },
              }}
            >
              <Typography variant='body2' fontWeight={500}>
                🔐 All API keys are encrypted with AES-256 encryption before
                transmission and storage
              </Typography>
            </Alert>

            {/* Calendar & Settings */}
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction='row' spacing={2} alignItems='center' mb={3}>
                  <Schedule color='primary' sx={{ fontSize: 28 }} />
                  <Typography variant='h5' fontWeight='600'>
                    Calendar & Settings
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Calendar ID'
                      name='calendar_id'
                      value={formData.calendar_id}
                      onChange={handleChange}
                      helperText='Google Calendar ID for scheduling'
                      variant='outlined'
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Time Zone</InputLabel>
                      <Select
                        name='time_zone'
                        value={formData.time_zone}
                        onChange={handleChange}
                        label='Time Zone'
                        sx={{ borderRadius: 2 }}
                      >
                        {time_zones.map((tz) => (
                          <MenuItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Reminder (Minutes)'
                      name='reminder_min'
                      type='number'
                      value={formData.reminder_min}
                      onChange={handleChange}
                      inputProps={{ min: 1 }}
                      variant='outlined'
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                        label='Status'
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value='active'>Active</MenuItem>
                        <MenuItem value='inactive'>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <Paper
              elevation={2}
              sx={{ p: 3, borderRadius: 3, bgcolor: "grey.50" }}
            >
              <Stack direction='row' spacing={3} justifyContent='center'>
                <Button
                  variant='outlined'
                  startIcon={<Cancel />}
                  onClick={() => navigate("/")}
                  size='large'
                  sx={{
                    minWidth: 150,
                    borderRadius: 2,
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color='inherit' />
                    ) : (
                      <Save />
                    )
                  }
                  disabled={loading}
                  size='large'
                  sx={{
                    minWidth: 150,
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Client"
                    : "Create Client"}
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default ClientForm;
