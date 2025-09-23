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
                        <MenuItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</MenuItem>
                        <MenuItem value='gpt-4'>GPT-4</MenuItem>
                        <MenuItem value='gpt-4-turbo'>GPT-4 Turbo</MenuItem>
                        <MenuItem value='gpt-4o'>GPT-4o</MenuItem>
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
                        {/* UTC */}
                        <MenuItem value='UTC'>UTC</MenuItem>

                        {/* Americas */}
                        <MenuItem value='America/New_York'>
                          America/New_York (EST/EDT)
                        </MenuItem>
                        <MenuItem value='America/Chicago'>
                          America/Chicago (CST/CDT)
                        </MenuItem>
                        <MenuItem value='America/Denver'>
                          America/Denver (MST/MDT)
                        </MenuItem>
                        <MenuItem value='America/Los_Angeles'>
                          America/Los_Angeles (PST/PDT)
                        </MenuItem>
                        <MenuItem value='America/Anchorage'>
                          America/Anchorage (AKST/AKDT)
                        </MenuItem>
                        <MenuItem value='America/Phoenix'>
                          America/Phoenix (MST)
                        </MenuItem>
                        <MenuItem value='America/Toronto'>
                          America/Toronto
                        </MenuItem>
                        <MenuItem value='America/Montreal'>
                          America/Montreal
                        </MenuItem>
                        <MenuItem value='America/Vancouver'>
                          America/Vancouver
                        </MenuItem>
                        <MenuItem value='America/Halifax'>
                          America/Halifax
                        </MenuItem>
                        <MenuItem value='America/Mexico_City'>
                          America/Mexico_City
                        </MenuItem>
                        <MenuItem value='America/Guatemala'>
                          America/Guatemala
                        </MenuItem>
                        <MenuItem value='America/Bogota'>
                          America/Bogota
                        </MenuItem>
                        <MenuItem value='America/Lima'>America/Lima</MenuItem>
                        <MenuItem value='America/Santiago'>
                          America/Santiago
                        </MenuItem>
                        <MenuItem value='America/Buenos_Aires'>
                          America/Buenos_Aires
                        </MenuItem>
                        <MenuItem value='America/Sao_Paulo'>
                          America/Sao_Paulo
                        </MenuItem>
                        <MenuItem value='America/Caracas'>
                          America/Caracas
                        </MenuItem>
                        <MenuItem value='America/Havana'>
                          America/Havana
                        </MenuItem>
                        <MenuItem value='America/Jamaica'>
                          America/Jamaica
                        </MenuItem>

                        {/* Europe */}
                        <MenuItem value='Europe/London'>
                          Europe/London (GMT/BST)
                        </MenuItem>
                        <MenuItem value='Europe/Dublin'>Europe/Dublin</MenuItem>
                        <MenuItem value='Europe/Paris'>
                          Europe/Paris (CET/CEST)
                        </MenuItem>
                        <MenuItem value='Europe/Berlin'>Europe/Berlin</MenuItem>
                        <MenuItem value='Europe/Rome'>Europe/Rome</MenuItem>
                        <MenuItem value='Europe/Madrid'>Europe/Madrid</MenuItem>
                        <MenuItem value='Europe/Amsterdam'>
                          Europe/Amsterdam
                        </MenuItem>
                        <MenuItem value='Europe/Brussels'>
                          Europe/Brussels
                        </MenuItem>
                        <MenuItem value='Europe/Vienna'>Europe/Vienna</MenuItem>
                        <MenuItem value='Europe/Zurich'>Europe/Zurich</MenuItem>
                        <MenuItem value='Europe/Prague'>Europe/Prague</MenuItem>
                        <MenuItem value='Europe/Warsaw'>Europe/Warsaw</MenuItem>
                        <MenuItem value='Europe/Budapest'>
                          Europe/Budapest
                        </MenuItem>
                        <MenuItem value='Europe/Bucharest'>
                          Europe/Bucharest
                        </MenuItem>
                        <MenuItem value='Europe/Athens'>Europe/Athens</MenuItem>
                        <MenuItem value='Europe/Helsinki'>
                          Europe/Helsinki
                        </MenuItem>
                        <MenuItem value='Europe/Stockholm'>
                          Europe/Stockholm
                        </MenuItem>
                        <MenuItem value='Europe/Oslo'>Europe/Oslo</MenuItem>
                        <MenuItem value='Europe/Copenhagen'>
                          Europe/Copenhagen
                        </MenuItem>
                        <MenuItem value='Europe/Moscow'>Europe/Moscow</MenuItem>
                        <MenuItem value='Europe/Kiev'>Europe/Kiev</MenuItem>
                        <MenuItem value='Europe/Istanbul'>
                          Europe/Istanbul
                        </MenuItem>

                        {/* Asia */}
                        <MenuItem value='Asia/Tokyo'>Asia/Tokyo (JST)</MenuItem>
                        <MenuItem value='Asia/Seoul'>Asia/Seoul</MenuItem>
                        <MenuItem value='Asia/Shanghai'>
                          Asia/Shanghai (CST)
                        </MenuItem>
                        <MenuItem value='Asia/Hong_Kong'>
                          Asia/Hong_Kong
                        </MenuItem>
                        <MenuItem value='Asia/Taipei'>Asia/Taipei</MenuItem>
                        <MenuItem value='Asia/Singapore'>
                          Asia/Singapore
                        </MenuItem>
                        <MenuItem value='Asia/Bangkok'>Asia/Bangkok</MenuItem>
                        <MenuItem value='Asia/Jakarta'>Asia/Jakarta</MenuItem>
                        <MenuItem value='Asia/Manila'>Asia/Manila</MenuItem>
                        <MenuItem value='Asia/Kuala_Lumpur'>
                          Asia/Kuala_Lumpur
                        </MenuItem>
                        <MenuItem value='Asia/Ho_Chi_Minh'>
                          Asia/Ho_Chi_Minh
                        </MenuItem>
                        <MenuItem value='Asia/Kolkata'>
                          Asia/Kolkata (IST)
                        </MenuItem>
                        <MenuItem value='Asia/Mumbai'>Asia/Mumbai</MenuItem>
                        <MenuItem value='Asia/Dhaka'>Asia/Dhaka</MenuItem>
                        <MenuItem value='Asia/Karachi'>Asia/Karachi</MenuItem>

                        {/* Middle East */}
                        <MenuItem value='Asia/Dubai'>Asia/Dubai (UAE)</MenuItem>
                        <MenuItem value='Asia/Qatar'>Asia/Qatar</MenuItem>
                        <MenuItem value='Asia/Kuwait'>Asia/Kuwait</MenuItem>
                        <MenuItem value='Asia/Bahrain'>Asia/Bahrain</MenuItem>
                        <MenuItem value='Asia/Muscat'>
                          Asia/Muscat (Oman)
                        </MenuItem>
                        <MenuItem value='Asia/Riyadh'>
                          Asia/Riyadh (Saudi Arabia)
                        </MenuItem>
                        <MenuItem value='Asia/Tehran'>
                          Asia/Tehran (Iran)
                        </MenuItem>
                        <MenuItem value='Asia/Baghdad'>
                          Asia/Baghdad (Iraq)
                        </MenuItem>
                        <MenuItem value='Asia/Damascus'>
                          Asia/Damascus (Syria)
                        </MenuItem>
                        <MenuItem value='Asia/Beirut'>
                          Asia/Beirut (Lebanon)
                        </MenuItem>
                        <MenuItem value='Asia/Amman'>
                          Asia/Amman (Jordan)
                        </MenuItem>
                        <MenuItem value='Asia/Jerusalem'>
                          Asia/Jerusalem (Israel)
                        </MenuItem>
                        <MenuItem value='Asia/Gaza'>
                          Asia/Gaza (Palestine)
                        </MenuItem>
                        <MenuItem value='Asia/Nicosia'>
                          Asia/Nicosia (Cyprus)
                        </MenuItem>
                        <MenuItem value='Asia/Yerevan'>
                          Asia/Yerevan (Armenia)
                        </MenuItem>
                        <MenuItem value='Asia/Tbilisi'>
                          Asia/Tbilisi (Georgia)
                        </MenuItem>
                        <MenuItem value='Asia/Baku'>
                          Asia/Baku (Azerbaijan)
                        </MenuItem>
                        <MenuItem value='Asia/Almaty'>Asia/Almaty</MenuItem>
                        <MenuItem value='Asia/Tashkent'>Asia/Tashkent</MenuItem>
                        <MenuItem value='Asia/Yekaterinburg'>
                          Asia/Yekaterinburg
                        </MenuItem>
                        <MenuItem value='Asia/Omsk'>Asia/Omsk</MenuItem>
                        <MenuItem value='Asia/Krasnoyarsk'>
                          Asia/Krasnoyarsk
                        </MenuItem>
                        <MenuItem value='Asia/Irkutsk'>Asia/Irkutsk</MenuItem>
                        <MenuItem value='Asia/Vladivostok'>
                          Asia/Vladivostok
                        </MenuItem>

                        {/* Africa */}
                        <MenuItem value='Africa/Cairo'>Africa/Cairo</MenuItem>
                        <MenuItem value='Africa/Lagos'>Africa/Lagos</MenuItem>
                        <MenuItem value='Africa/Nairobi'>
                          Africa/Nairobi
                        </MenuItem>
                        <MenuItem value='Africa/Johannesburg'>
                          Africa/Johannesburg
                        </MenuItem>
                        <MenuItem value='Africa/Casablanca'>
                          Africa/Casablanca
                        </MenuItem>
                        <MenuItem value='Africa/Algiers'>
                          Africa/Algiers
                        </MenuItem>
                        <MenuItem value='Africa/Tunis'>Africa/Tunis</MenuItem>
                        <MenuItem value='Africa/Addis_Ababa'>
                          Africa/Addis_Ababa
                        </MenuItem>
                        <MenuItem value='Africa/Dar_es_Salaam'>
                          Africa/Dar_es_Salaam
                        </MenuItem>
                        <MenuItem value='Africa/Kampala'>
                          Africa/Kampala
                        </MenuItem>
                        <MenuItem value='Africa/Khartoum'>
                          Africa/Khartoum
                        </MenuItem>

                        {/* Australia/Oceania */}
                        <MenuItem value='Australia/Sydney'>
                          Australia/Sydney (AEST/AEDT)
                        </MenuItem>
                        <MenuItem value='Australia/Melbourne'>
                          Australia/Melbourne
                        </MenuItem>
                        <MenuItem value='Australia/Brisbane'>
                          Australia/Brisbane
                        </MenuItem>
                        <MenuItem value='Australia/Perth'>
                          Australia/Perth
                        </MenuItem>
                        <MenuItem value='Australia/Adelaide'>
                          Australia/Adelaide
                        </MenuItem>
                        <MenuItem value='Australia/Darwin'>
                          Australia/Darwin
                        </MenuItem>
                        <MenuItem value='Pacific/Auckland'>
                          Pacific/Auckland
                        </MenuItem>
                        <MenuItem value='Pacific/Fiji'>Pacific/Fiji</MenuItem>
                        <MenuItem value='Pacific/Honolulu'>
                          Pacific/Honolulu (HST)
                        </MenuItem>
                        <MenuItem value='Pacific/Guam'>Pacific/Guam</MenuItem>
                        <MenuItem value='Pacific/Tahiti'>
                          Pacific/Tahiti
                        </MenuItem>

                        {/* Atlantic */}
                        <MenuItem value='Atlantic/Azores'>
                          Atlantic/Azores
                        </MenuItem>
                        <MenuItem value='Atlantic/Canary'>
                          Atlantic/Canary
                        </MenuItem>
                        <MenuItem value='Atlantic/Cape_Verde'>
                          Atlantic/Cape_Verde
                        </MenuItem>
                        <MenuItem value='Atlantic/Reykjavik'>
                          Atlantic/Reykjavik
                        </MenuItem>
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
