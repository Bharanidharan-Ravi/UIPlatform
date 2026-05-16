import { useStore } from 'zustand';
import { apiStore } from './apiStore.js';

export function useApiState(selector = (state) => state) {
  return useStore(apiStore, selector);
}
