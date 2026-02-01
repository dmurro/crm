// queryClient.js - React Query Configuration
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds - data is considered fresh
      gcTime: 5 * 60 * 1000, // 5 minutes - cache time (formerly cacheTime)
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true, // Refetch when network reconnects
      retry: 1, // Retry failed requests once
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 0, // Don't retry mutations by default
      onError: (error) => {
        // Global error handling for mutations
        console.error("Mutation error:", error);
      },
    },
  },
});

// hooks/useApiQueries.js - All API hooks
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";

// ==================== AUTH ====================

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClient.post("/login", credentials);
      console.log(response)
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("auth", JSON.stringify({ jwt: data.token }));
      queryClient.invalidateQueries();
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call logout endpoint if you have one
      // await apiClient.post("/logout");
      localStorage.removeItem("auth");
    },
    onSuccess: () => {
      queryClient.clear(); // Clear all queries on logout
    },
  });
};

// ==================== CLIENTS ====================

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await apiClient.get("/clients", {
        params: { limit: 5000 },
      });
      return response.data?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useClient = (id) => {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: async () => {
      const response = await apiClient.get(`/clients/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData) => {
      const response = await apiClient.post("/clients", clientData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/clients/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", variables.id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/clients/${id}`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      const previousClients = queryClient.getQueryData(["clients"]);

      queryClient.setQueryData(["clients"], (old) =>
        old?.filter((client) => client._id !== deletedId)
      );

      return { previousClients };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["clients"], context.previousClients);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

// ==================== CAMPAIGNS ====================

export const useCampaigns = () => {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await apiClient.get("/campaigns");
      return response.data.campaigns || [];
    },
    staleTime: 30000,
  });
};

export const useCampaign = (id) => {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: async () => {
      const response = await apiClient.get(`/campaigns/${id}`);
      return response.data.campaign;
    },
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignData) => {
      const response = await apiClient.post("/campaigns", campaignData);
      return response.data.campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/campaigns/${id}`, data);
      return response.data.campaign;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", variables.id] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/campaigns/${id}`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["campaigns"] });
      const previousCampaigns = queryClient.getQueryData(["campaigns"]);

      queryClient.setQueryData(["campaigns"], (old) =>
        old?.filter((campaign) => campaign._id !== deletedId)
      );

      return { previousCampaigns };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["campaigns"], context.previousCampaigns);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
};

export const useSendCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.post(`/campaigns/${id}/send`);
      return response.data.campaign;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", variables] });
    },
  });
};

// ==================== MODELS (Email Templates) ====================

export const useModels = (params = {}) => {
  return useQuery({
    queryKey: ["models", params],
    queryFn: async () => {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/models?${queryString}`);
      return response.data.models || [];
    },
    staleTime: 5 * 60 * 1000, // Models change less frequently
  });
};

export const useModel = (id) => {
  return useQuery({
    queryKey: ["models", id],
    queryFn: async () => {
      const response = await apiClient.get(`/models/${id}`);
      return response.data.model;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modelData) => {
      const response = await apiClient.post("/models", modelData);
      return response.data.model;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};

export const useUpdateModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/models/${id}`, data);
      return response.data.model;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      queryClient.invalidateQueries({ queryKey: ["models", variables.id] });
    },
  });
};

export const useDeleteModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/models/${id}`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["models"] });
      const previousModels = queryClient.getQueryData(["models"]);

      queryClient.setQueryData(["models"], (old) =>
        old?.filter((model) => model._id !== deletedId)
      );

      return { previousModels };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["models"], context.previousModels);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};

// ==================== EMAILS ====================

export const useEmails = (params = {}) => {
  return useQuery({
    queryKey: ["emails", params],
    queryFn: async () => {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/emails?${queryString}`);
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
};

export const useEmail = (id) => {
  return useQuery({
    queryKey: ["emails", id],
    queryFn: async () => {
      const response = await apiClient.get(`/emails/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useSendEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailData) => {
      const response = await apiClient.post("/emails/send", emailData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
};

// ==================== ATTACHMENTS ====================

export const useAttachments = () => {
  return useQuery({
    queryKey: ["attachments"],
    queryFn: async () => {
      const response = await apiClient.get("/attachments");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUploadAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post("/attachments/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/attachments/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
};

// ==================== STATS / ANALYTICS ====================

export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await apiClient.get("/stats");
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
};

export const useCampaignStats = (campaignId) => {
  return useQuery({
    queryKey: ["stats", "campaign", campaignId],
    queryFn: async () => {
      const response = await apiClient.get(`/campaigns/${campaignId}/stats`);
      return response.data;
    },
    enabled: !!campaignId,
    staleTime: 60000,
  });
};