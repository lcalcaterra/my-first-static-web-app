export function saveToken(token) {
  sessionStorage.setItem("access_token", token);
}

export function getToken() {
  return sessionStorage.getItem("access_token");
}

export function clearToken() {
  sessionStorage.removeItem("access_token");
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}