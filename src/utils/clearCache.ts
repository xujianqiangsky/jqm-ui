import { clearTokenInfo, clearAuthenticationStatus } from './tokenUtils';
import { clearMenuCache } from './menuUtils';

export function clearAllCache() {
  clearAuthenticationStatus();
  clearTokenInfo();
  clearMenuCache();
}
