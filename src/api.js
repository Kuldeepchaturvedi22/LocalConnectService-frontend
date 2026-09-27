const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export async function api(path, options = {}) {
  const token = sessionStorage.getItem('lcsAccessToken');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Request failed');
  return body;
}

export const authApi = {
  login: credentials => api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  me: () => api('/auth/me')
};

export const dashboardApi = {
  summary: () => api('/dashboard/summary')
};

export const enquiryApi = {
  list: (page = 0) => api(`/enquiries?page=${page}`),
  create: data => api('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => api(`/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
};

export const companyApi = {
  list: (page = 0) => api(`/companies?page=${page}`),
  create: data => api('/companies', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => api(`/companies/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
};

export const userApi = {
  list: (page = 0) => api(`/users?page=${page}`),
  create: data => api('/users', { method: 'POST', body: JSON.stringify(data) })
};
