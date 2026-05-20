import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildNavigationPath,
  goBackSafe,
  goToRouteKey,
  navigateWithParams
} from '../SmartNavigate.jsx';

export function useSmartNavigation() {
  const navigate = useNavigate();

  return {
    navigate,
    buildNavigationPath,
    goToRouteKey: useCallback(
      (routeKey, params, options) =>
        goToRouteKey(navigate, routeKey, params, options),
      [navigate]
    ),
    goBackSafe: useCallback(
      (fallbackPath, options) => goBackSafe(navigate, fallbackPath, options),
      [navigate]
    ),
    navigateWithParams: useCallback(
      (routeKeyOrPath, params, options) =>
        navigateWithParams(navigate, routeKeyOrPath, params, options),
      [navigate]
    )
  };
}
