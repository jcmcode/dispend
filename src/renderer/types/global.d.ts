import type { DispendAPI } from '../../shared/types/api';

declare global {
  interface Window {
    api: DispendAPI;
  }
}
