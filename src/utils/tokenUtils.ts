import { useStorage } from '@vueuse/core';
import { TOKEN_PREFIX, AUTHENTICATED_STATUS_PREFIX } from '@/constants/cachePrefix';

export function getTokenInfo() {
  const tokenInfo = useStorage<TokenInfo>(TOKEN_PREFIX, { tokenValue: '', loginDevice: '' });
  return tokenInfo.value;
}

export function saveTokenInfo(token: TokenInfo) {
  const tokenInfo = useStorage<TokenInfo>(TOKEN_PREFIX, token);
  tokenInfo.value = token;
}

export function clearTokenInfo() {
  const tokenInfo = useStorage<TokenInfo>(TOKEN_PREFIX, { tokenValue: '', loginDevice: '' });
  tokenInfo.value = null;
}

export function getAuthenticationStatus() {
  const isAuthenticated = useStorage<boolean>(AUTHENTICATED_STATUS_PREFIX, false);
  return isAuthenticated.value;
}

export function setAuthenticationStatus(status: boolean) {
  const isAuthenticated = useStorage<boolean>(AUTHENTICATED_STATUS_PREFIX, status);
  isAuthenticated.value = status;
}

export function clearAuthenticationStatus() {
  const isAuthenticated = useStorage<boolean>(AUTHENTICATED_STATUS_PREFIX, false);
  isAuthenticated.value = null;
}
