import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
apiClient.interceptors.request.use(
  (config) => {
    // Add mock user ID to requests
    config.params = {
      ...config.params,
      user_id: 1 // Mock user
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  decisions: {
    create: (data: { user_id: number; title: string; description: string }) =>
      apiClient.post('/decisions/', data),
    get: (id: number) => apiClient.get(`/decisions/${id}`),
    update: (id: number, data: { status?: string; resolved_at?: string }) =>
      apiClient.patch(`/decisions/${id}`, data),
    getUserDecisions: (userId: number) => apiClient.get(`/decisions/user/${userId}`),
  },
  chat: {
    startDiagnostic: (decisionId: number) =>
      apiClient.post('/chat/diagnostic', { decision_id: decisionId }),
    sendMessage: (decisionId: number, message: string) =>
      apiClient.post('/chat/message', { decision_id: decisionId, message }),
    getTradeoffs: (decisionId: number) =>
      apiClient.post(`/chat/tradeoffs/${decisionId}`),
  },
  simulation: {
    run: (data: { decision_id: number; options?: string[] }) =>
      apiClient.post('/simulation/run', data),
    getScenarios: (decisionId: number) =>
      apiClient.get(`/simulation/${decisionId}/scenarios`),
  },
  report: {
    generate: (decisionId: number) =>
      apiClient.post('/report/generate', { decision_id: decisionId }),
    exportPDF: (decisionId: number) =>
      apiClient.post('/report/export-pdf', { decision_id: decisionId }, {
        responseType: 'blob',
      }).then((response) => {
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response as any]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `decision_report_${decisionId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }),
  },
};