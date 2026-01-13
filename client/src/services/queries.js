import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./api";

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClient.post("/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("auth", JSON.stringify({ jwt: data.token }));
      // Invalidate and refetch any queries that depend on auth
      queryClient.invalidateQueries();
    },
  });
};

// Clients query
export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await apiClient.get("/clients");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
