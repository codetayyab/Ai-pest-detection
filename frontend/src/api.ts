export const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
};
