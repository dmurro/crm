import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Tabs,
  Tab,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  useSendCampaign,
  useCampaignRecipients,
  useClientsCount,
  useModels,
  useClients,
} from "../services/queries";

const Campaign = () => {
  const theme = useTheme();

  // UI State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [recipientTab, setRecipientTab] = useState(0);
  const [selectedClients, setSelectedClients] = useState([]);
  const [recipientsPage, setRecipientsPage] = useState(1);
  const [recipientsPerPage] = useState(25);
  const [formData, setFormData] = useState({
    name: "",
    modelId: "",
    subject: "",
    recipients: [],
    recipientSource: "manual",
  });

  // React Query Hooks
  const { data: campaigns = [], isLoading: campaignsLoading, error: campaignsError } = useCampaigns();
  const { data: models = [] } = useModels({ limit: 100 });
  const { data: clients = [] } = useClients();
  const { data: clientsCount } = useClientsCount({ hasEmail: "true" });
  const { data: recipientsData, isLoading: recipientsLoading } = useCampaignRecipients(
    selectedCampaign?._id,
    { page: recipientsPage, limit: recipientsPerPage }
  );

  // Mutations
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();
  const sendMutation = useSendCampaign();

  // Helper functions
  const getStatusColor = (status) => {
    const statusMap = {
      draft: "default",
      sending: "info",
      sent: "success",
      failed: "error",
    };
    return statusMap[status] || "default";
  };

  const resetForm = () => {
    setFormData({
      name: "",
      modelId: "",
      subject: "",
      recipients: [],
      recipientSource: "manual",
    });
    setSelectedClients([]);
    setRecipientTab(0);
    setEditingCampaign(null);
  };

  // Event handlers
  const handleCreateCampaign = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditCampaign = (campaign) => {
    if (campaign.status !== "draft") return;

    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      modelId: campaign.modelId?._id || campaign.modelId || "",
      subject: campaign.subject,
      recipients: campaign.recipients || [],
      recipientSource: campaign.recipientSource || "manual",
    });
    setSelectedClients(
      campaign.recipientSource === "clients"
        ? (clients || [])
          .filter((c) => campaign.recipients.includes(c.email))
          .map((c) => c.email)
        : []
    );
    setRecipientTab(campaign.recipientSource === "clients" ? 1 : 0);
    setDialogOpen(true);
  };

  const handleSaveCampaign = () => {
    if (!formData.name.trim() || !formData.modelId || !formData.subject.trim()) {
      return;
    }

    if (
      formData.recipientSource !== "all_clients" &&
      formData.recipients.length === 0
    ) {
      return;
    }


    if (editingCampaign) {
      updateMutation.mutate(
        { id: editingCampaign._id, data: formData },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleDeleteCampaign = (id, event) => {
    event.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this campaign?")) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const handleViewDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setRecipientsPage(1);
    setDetailsDialogOpen(true);
  };

  const handleSendCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setSendDialogOpen(true);
  };

  const confirmSendCampaign = () => {
    if (!selectedCampaign) return;

    sendMutation.mutate(selectedCampaign._id, {
      onSuccess: (data) => {
        setSelectedCampaign(data);
        setSendDialogOpen(false);
        setDetailsDialogOpen(false);
      },
    });
  };

  const handleModelSelect = (modelId) => {
    const selectedModel = models.find((m) => m._id === modelId);
    setFormData({
      ...formData,
      modelId,
      subject: selectedModel ? selectedModel.subject : formData.subject,
    });
  };

  const handleManualRecipientsChange = (value) => {
    const emails = value
      .split("\n")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
    setFormData({
      ...formData,
      recipients: emails,
      recipientSource: "manual",
    });
  };

  const toggleClientSelection = (email) => {
    const newSelected = selectedClients.includes(email)
      ? selectedClients.filter((e) => e !== email)
      : [...selectedClients, email];
    setSelectedClients(newSelected);
    setFormData({
      ...formData,
      recipients: newSelected,
      recipientSource: "clients",
    });
  };

  const handleSelectAllClients = (checked) => {
    const allEmails = (clients || []).map((c) => c.email).filter(Boolean);
    const newSelected = checked ? allEmails : [];
    setSelectedClients(newSelected);
    setFormData({
      ...formData,
      recipients: newSelected,
      recipientSource: "clients",
    });
  };

  const handleRecipientTabChange = (event, newValue) => {
    setRecipientTab(newValue);

    // MANUAL
    if (newValue === 0) {
      setSelectedClients([]);
      setFormData({
        ...formData,
        recipients: [],
        recipientSource: "manual",
      });
    }

    // SELECT CLIENTS
    if (newValue === 1) {
      setFormData({
        ...formData,
        recipients: selectedClients,
        recipientSource: "clients",
      });
    }

    // ALL CLIENTS (SERVER SIDE)
    if (newValue === 2) {
      setSelectedClients([]);
      setFormData({
        ...formData,
        recipients: ["__ALL__"], // placeholder
        recipientSource: "all_clients",
      });
    }
  };

  // Combined error handling
  const error =
    campaignsError ||
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error ||
    sendMutation.error;

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isSending = sendMutation.isPending;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Campaigns
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCampaign}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          Create Campaign
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => {
            createMutation.reset();
            updateMutation.reset();
            deleteMutation.reset();
            sendMutation.reset();
          }}
        >
          {error?.response?.data?.error ||
            error?.response?.data?.message ||
            error?.message ||
            "An error occurred"}
        </Alert>
      )}

      {/* Campaigns List */}
      {campaignsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : campaigns.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
          <EmailIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No campaigns yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click Create Campaign to get started
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((campaign) => (
            <Grid item xs={12} sm={6} md={4} key={campaign._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                      >
                        {campaign.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                        <Chip label={campaign.status} size="small" color={getStatusColor(campaign.status)} />
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteCampaign(campaign._id, e)}
                      sx={{
                        color: theme.palette.error.main,
                        "&:hover": {
                          backgroundColor: `${theme.palette.error.main}10`,
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                      }}
                    >
                      Template
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {campaign.modelId?.name || "N/A"}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                      }}
                    >
                      Subject
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {campaign.subject}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                      }}
                    >
                      Recipients
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {campaign.stats?.total ?? campaign.recipients?.length ?? 0} recipients
                    </Typography>
                  </Box>

                  {campaign.stats && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: "text.secondary",
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                        }}
                      >
                        Stats
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Sent: {campaign.stats.sent || 0} / {campaign.stats.total || 0}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                    {campaign.status === "draft" && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(campaign)}
                    >
                      Details
                    </Button>
                    {campaign.status === "draft" && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={() => handleSendCampaign(campaign)}
                      >
                        Send
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingCampaign ? "Edit Campaign" : "Create New Campaign"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Campaign Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter campaign name"
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Email Template</InputLabel>
              <Select value={formData.modelId} label="Email Template" onChange={(e) => handleModelSelect(e.target.value)}>
                {models.map((model) => (
                  <MenuItem key={model._id} value={model._id}>
                    {model.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Email Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Enter email subject"
              required
              fullWidth
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Recipients ({formData.recipients.length})
              </Typography>
              <Tabs value={recipientTab} onChange={handleRecipientTabChange}>
                <Tab label="Manual" />
                <Tab label="From Clients" />
                <Tab label="All Clients" />
              </Tabs>

              <Box sx={{ mt: 2 }}>
                {recipientTab === 0 && (
                  <TextField
                    label="Email Addresses"
                    value={formData.recipients.join("\n")}
                    onChange={(e) => handleManualRecipientsChange(e.target.value)}
                    placeholder="Enter email addresses, one per line"
                    multiline
                    rows={6}
                    fullWidth
                    helperText="Enter one email address per line"
                  />
                )}
                {recipientTab === 1 && (
                  <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                    <List>
                      <ListItem disablePadding sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <ListItemButton
                          onClick={() => handleSelectAllClients(selectedClients.length !== clients.length)}
                          dense
                        >
                          <Checkbox
                            checked={clients.length > 0 && selectedClients.length === clients.length}
                            indeterminate={selectedClients.length > 0 && selectedClients.length < clients.length}
                            onChange={(e) => handleSelectAllClients(e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <ListItemText
                            primary="Select all"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondary={`${selectedClients.length} of ${clients.length} selected`}
                          />
                        </ListItemButton>
                      </ListItem>
                      {clients.map((client) => (
                        <ListItem key={client._id || client.email} disablePadding>
                          <ListItemButton onClick={() => toggleClientSelection(client.email)}>
                            <Checkbox checked={selectedClients.includes(client.email)} />
                            <ListItemText
                              primary={client.email}
                              secondary={[client.firstName, client.lastName].filter(Boolean).join(" ") || "—"}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {recipientTab === 2 && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {typeof clientsCount === "number"
                      ? `All contacts with email will be included (~${clientsCount} recipients)`
                      : "All contacts with email will be included"}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" startIcon={<CloseIcon />} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveCampaign}
            variant="contained"
            startIcon={isSaving ? <CircularProgress size={16} /> : <AddIcon />}
            disabled={isSaving}
          >
            {editingCampaign ? "Update Campaign" : "Create Campaign"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Campaign Details</DialogTitle>
        <DialogContent>
          {selectedCampaign && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase" }}>
                  Name
                </Typography>
                <Typography variant="body1">{selectedCampaign.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase" }}>
                  Status
                </Typography>
                <Chip label={selectedCampaign.status} size="small" color={getStatusColor(selectedCampaign.status)} sx={{ mt: 0.5 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase" }}>
                  Template
                </Typography>
                <Typography variant="body1">{selectedCampaign.modelId?.name || "N/A"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase" }}>
                  Subject
                </Typography>
                <Typography variant="body1">{selectedCampaign.subject}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase" }}>
                  Recipients
                </Typography>
                <Typography variant="body1">
                  {selectedCampaign.stats?.total ?? selectedCampaign.recipients?.length ?? 0} recipients
                </Typography>
              </Box>
              {selectedCampaign.stats && (
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase" }}>
                    Statistics
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Total: {selectedCampaign.stats.total || 0}
                  </Typography>
                  <Typography variant="body2">Sent: {selectedCampaign.stats.sent || 0}</Typography>
                  <Typography variant="body2">Failed: {selectedCampaign.stats.failed || 0}</Typography>
                </Box>
              )}
              {(selectedCampaign.status === "sending" || selectedCampaign.status === "sent") && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase" }}>
                    Stato per destinatario
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ mt: 1, maxHeight: 280 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Stato</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Data invio</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Errore</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recipientsLoading ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                              <CircularProgress size={24} />
                            </TableCell>
                          </TableRow>
                        ) : !recipientsData?.recipients?.length ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 2 }} color="text.secondary">
                              Nessun destinatario
                            </TableCell>
                          </TableRow>
                        ) : (
                          recipientsData.recipients.map((rec) => (
                            <TableRow key={rec._id}>
                              <TableCell>{rec.email}</TableCell>
                              <TableCell>
                                <Chip
                                  label={rec.status}
                                  size="small"
                                  color={rec.status === "sent" ? "success" : rec.status === "failed" ? "error" : "default"}
                                />
                              </TableCell>
                              <TableCell>
                                {rec.sentAt ? new Date(rec.sentAt).toLocaleString() : "—"}
                              </TableCell>
                              <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>
                                {rec.error || "—"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {recipientsData?.pagination && recipientsData.pagination.pages > 1 && (
                    <TablePagination
                      component="div"
                      count={recipientsData.pagination.total}
                      page={recipientsPage - 1}
                      onPageChange={(_, newPage) => setRecipientsPage(newPage + 1)}
                      rowsPerPage={recipientsPerPage}
                      rowsPerPageOptions={[25, 50]}
                      labelRowsPerPage="Righe:"
                      sx={{ borderTop: 1, borderColor: "divider" }}
                    />
                  )}
                </Box>
              )}
              {selectedCampaign.stats?.errors && selectedCampaign.stats.errors.length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase" }}>
                    Errors
                  </Typography>
                  {selectedCampaign.stats.errors.map((error, index) => (
                    <Typography key={index} variant="body2" color="error" sx={{ mt: 0.5 }}>
                      {error.recipient}: {error.error}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedCampaign?.status === "draft" && (
            <Button variant="contained" startIcon={<SendIcon />} onClick={() => handleSendCampaign(selectedCampaign)}>
              Send Campaign
            </Button>
          )}
          <Button onClick={() => setDetailsDialogOpen(false)} variant="outlined" startIcon={<CloseIcon />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Confirmation Dialog */}
      <Dialog open={sendDialogOpen} onClose={() => setSendDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Campaign</DialogTitle>
        <DialogContent>
          {selectedCampaign && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>Are you sure you want to send this campaign?</Typography>
              <Box>
                <Typography variant="subtitle2">Campaign: {selectedCampaign.name}</Typography>
                <Typography variant="body2">
                  Recipients: {selectedCampaign.stats?.total ?? selectedCampaign.recipients?.length ?? 0}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Emails will be sent gradually (max 380/hour). You can track status in campaign details.
              </Typography>
              {isSending && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Enqueueing campaign...
                  </Typography>
                  <LinearProgress />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialogOpen(false)} variant="outlined" disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={confirmSendCampaign}
            variant="contained"
            startIcon={isSending ? <CircularProgress size={16} /> : <SendIcon />}
            disabled={isSending}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Campaign;