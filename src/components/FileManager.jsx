import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Snackbar,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  CloudUpload,
  InsertDriveFile,
  Link as LinkIcon,
  Delete,
  Download,
  Add,
  Close,
} from "@mui/icons-material";
import { fileAPI } from "../services/api";

const FileManager = ({ accountId, clientName }) => {
  const [documents, setDocuments] = useState([]);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(null); // Track which file is being downloaded
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // Dialog states
  const [uploadDialog, setUploadDialog] = useState(false);
  const [urlDialog, setUrlDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: "",
    item: null,
  });

  // Form states
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    if (accountId) {
      fetchData();
    }
  }, [accountId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsResponse, urlsResponse] = await Promise.all([
        fileAPI.getDocuments(accountId),
        fileAPI.getProcessedURLs(accountId),
      ]);

      console.log("URLs Response:", urlsResponse.data);
      setDocuments(docsResponse.data.documents || []);
      setUrls(urlsResponse.data.urls || urlsResponse.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch files and URLs");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      await fileAPI.uploadFile(accountId, selectedFile);
      setSuccess("File uploaded successfully!");
      setUploadDialog(false);
      setSelectedFile(null);
      fetchData();
    } catch (err) {
      setError(
        "Failed to upload file: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setUploading(false);
    }
  };

  const handleURLProcess = async () => {
    if (!urlInput.trim()) return;

    try {
      setUploading(true);
      await fileAPI.processURL(accountId, urlInput.trim());
      setSuccess("URL processed successfully!");
      setUrlDialog(false);
      setUrlInput("");
      fetchData();
    } catch (err) {
      setError(
        "Failed to process URL: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const { type, item } = deleteDialog;

    try {
      setLoading(true);
      if (type === "document") {
        await fileAPI.deleteDocument(accountId, item.document_id);
      } else if (type === "url") {
        await fileAPI.deleteURLDocument(accountId, item);
      }

      setSuccess(
        `${type === "document" ? "File" : "URL"} deleted successfully!`
      );
      setDeleteDialog({ open: false, type: "", item: null });
      fetchData();
    } catch (err) {
      setError(
        `Failed to delete ${type}: ` +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      setDownloading(doc.document_id);
      setError(null);

      // Use the new secure download API endpoint
      const response = await fileAPI.downloadFile(accountId, doc.document_id);

      // Create blob from response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Get filename from Content-Disposition header or use doc.file_name
      const contentDisposition = response.headers["content-disposition"];
      let filename = doc.file_name;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);

      setSuccess(`Successfully downloaded ${filename}`);
    } catch (err) {
      setError(
        "Failed to download file: " +
          (err.response?.data?.error || err.message || "Unknown error")
      );
      console.error("Download error:", err);
    } finally {
      setDownloading(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get unique documents (group by document_id)
  const uniqueDocuments = documents.reduce((acc, doc) => {
    if (!acc.find((d) => d.document_id === doc.document_id)) {
      acc.push(doc);
    }
    return acc;
  }, []);

  if (loading && !uploading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='200px'
      >
        <CircularProgress />
        <Typography variant='body1' sx={{ ml: 2 }}>
          Loading files...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          flexWrap='wrap'
          gap={2}
        >
          <Box>
            <Typography variant='h5' gutterBottom>
              Knowledge Base
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {uniqueDocuments.length} files, {urls.length} URLs
            </Typography>
          </Box>
          <Box display='flex' gap={2} flexWrap='wrap'>
            <Button
              variant='contained'
              startIcon={<CloudUpload />}
              onClick={() => setUploadDialog(true)}
              sx={{ minWidth: 140 }}
            >
              Upload File
            </Button>
            <Button
              variant='outlined'
              startIcon={<LinkIcon />}
              onClick={() => setUrlDialog(true)}
              sx={{ minWidth: 120 }}
            >
              Add URL
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Documents Section */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2} sx={{ height: "fit-content" }}>
            <CardContent sx={{ p: 3 }}>
              <Box display='flex' alignItems='center' mb={2}>
                <InsertDriveFile color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>
                  Documents ({uniqueDocuments.length})
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {uniqueDocuments.length === 0 ? (
                <Box
                  textAlign='center'
                  py={4}
                  sx={{
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    border: "1px dashed",
                    borderColor: "grey.300",
                  }}
                >
                  <InsertDriveFile
                    sx={{ fontSize: 48, color: "grey.400", mb: 1 }}
                  />
                  <Typography variant='body1' color='text.secondary'>
                    No documents uploaded yet
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Upload your first document to get started
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {uniqueDocuments.map((doc, index) => (
                    <Box key={doc.document_id}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 2,
                          display: "flex",
                          alignItems: "flex-start",
                          "&:hover": {
                            bgcolor: "grey.50",
                            borderRadius: 1,
                          },
                        }}
                      >
                        <ListItemText
                          sx={{ pr: 10 }} // Add right padding to prevent overlap
                          primary={
                            <Typography
                              variant='subtitle2'
                              sx={{ fontWeight: 600 }}
                            >
                              {doc.file_name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant='caption'
                                display='block'
                                color='text.secondary'
                              >
                                {formatFileSize(doc.file_size)} •{" "}
                                {doc.file_type} •{" "}
                                {formatDate(doc.processing_date)}
                              </Typography>
                              <Chip
                                label={`${
                                  documents.filter(
                                    (d) => d.document_id === doc.document_id
                                  ).length
                                } chunks`}
                                size='small'
                                variant='outlined'
                                color='primary'
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          }
                        />
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <Tooltip
                            title={
                              downloading === doc.document_id
                                ? "Downloading..."
                                : "Download"
                            }
                          >
                            <IconButton
                              onClick={() => handleDownload(doc)}
                              color='primary'
                              size='small'
                              disabled={downloading === doc.document_id}
                            >
                              {downloading === doc.document_id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Download />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  type: "document",
                                  item: doc,
                                })
                              }
                              color='error'
                              size='small'
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                      {index < uniqueDocuments.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* URLs Section */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2} sx={{ height: "fit-content" }}>
            <CardContent sx={{ p: 3 }}>
              <Box display='flex' alignItems='center' mb={2}>
                <LinkIcon color='primary' sx={{ mr: 1 }} />
                <Typography variant='h6'>
                  Processed URLs ({urls.length})
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {urls.length === 0 ? (
                <Box
                  textAlign='center'
                  py={4}
                  sx={{
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    border: "1px dashed",
                    borderColor: "grey.300",
                  }}
                >
                  <LinkIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
                  <Typography variant='body1' color='text.secondary'>
                    No URLs processed yet
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Add your first URL to get started
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {urls.map((urlItem, index) => (
                    <Box key={index}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 2,
                          display: "flex",
                          alignItems: "flex-start",
                          "&:hover": {
                            bgcolor: "grey.50",
                            borderRadius: 1,
                          },
                        }}
                      >
                        <ListItemText
                          sx={{ pr: 8 }} // Add right padding to prevent overlap
                          primary={
                            <Typography
                              variant='subtitle2'
                              sx={{
                                fontWeight: 600,
                                wordBreak: "break-all",
                                color: "primary.main",
                              }}
                            >
                              {typeof urlItem === "string"
                                ? urlItem
                                : urlItem.url || urlItem.title || "Unknown URL"}
                            </Typography>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                mt: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Chip
                                label='URL'
                                size='small'
                                color='primary'
                                variant='outlined'
                              />
                              {urlItem.title && typeof urlItem === "object" && (
                                <Chip
                                  label={urlItem.title}
                                  size='small'
                                  color='secondary'
                                  variant='outlined'
                                />
                              )}
                            </Box>
                          }
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <Tooltip title='Delete'>
                            <IconButton
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  type: "url",
                                  item:
                                    typeof urlItem === "string"
                                      ? urlItem
                                      : urlItem.url,
                                })
                              }
                              color='error'
                              size='small'
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                      {index < urls.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload File Dialog */}
      <Dialog
        open={uploadDialog}
        onClose={() => setUploadDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              Supported formats: PDF, TXT, CSV, DOC, DOCX, XLS, XLSX, RTF
            </Typography>
            <input
              type='file'
              accept='.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.rtf'
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ width: "100%", padding: "10px", marginTop: "10px" }}
            />
            {selectedFile && (
              <Typography variant='body2' sx={{ mt: 1 }}>
                Selected: {selectedFile.name} (
                {formatFileSize(selectedFile.size)})
              </Typography>
            )}
          </Box>
          {uploading && <LinearProgress sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleFileUpload}
            disabled={!selectedFile || uploading}
            variant='contained'
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add URL Dialog */}
      <Dialog
        open={urlDialog}
        onClose={() => setUrlDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Process URL</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='URL'
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder='https://example.com'
            margin='normal'
            helperText='Enter a URL to crawl and process its content'
          />
          {uploading && <LinearProgress sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUrlDialog(false)}>Cancel</Button>
          <Button
            onClick={handleURLProcess}
            disabled={!urlInput.trim() || uploading}
            variant='contained'
          >
            {uploading ? "Processing..." : "Process URL"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: "", item: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteDialog.type}? This
            action cannot be undone.
          </Typography>
          {deleteDialog.item && (
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              {deleteDialog.type === "document"
                ? deleteDialog.item.file_name
                : deleteDialog.item}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog({ open: false, type: "", item: null })
            }
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
        message={success}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity='error' onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileManager;
