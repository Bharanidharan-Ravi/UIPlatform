// src/app/hooks/useSmartNavigation.js
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildNavigationPath,
  goBackSafe,
  goToRouteKey,
  navigateWithParams,
  findSequentialSibling
} from '../SmartNavigate.jsx';

export function useSmartNavigation(currentActiveKey, options = {}) {
  const navigate = useNavigate();
  const shouldLoop = options.loop === true;

  /**
   * Safe forward stepping with strict final boundary enforcement
   */
  const goNext = useCallback(
    (params = {}, navOptions = {}) => {
      if (!currentActiveKey) return;
      
      const nextKey = findSequentialSibling(currentActiveKey, 1);
      
      if (nextKey) {
        return goToRouteKey(navigate, nextKey, params, navOptions);
      }
      
      // If loop configuration is active, cycle back to the first child step layout
      if (shouldLoop) {
        const firstKey = findSequentialSibling(currentActiveKey, -2); // Looks back to start
        if (firstKey) return goToRouteKey(navigate, firstKey, params, navOptions);
      } else {
        console.log(`[Platform Navigation] Terminal step boundary reached at: "${currentActiveKey}". Navigation blocked.`);
      }
    },
    [navigate, currentActiveKey, shouldLoop]
  );

  /**
   * Safe backward stepping with strict step 1 boundary enforcement
   */
  const goBackStep = useCallback(
    (params = {}, navOptions = {}) => {
      if (!currentActiveKey) return;
      
      const prevKey = findSequentialSibling(currentActiveKey, -1);
      
      if (prevKey) {
        return goToRouteKey(navigate, prevKey, params, navOptions);
      }
      
      // If loop configuration is active, wrap around to the final child step layout
      if (shouldLoop) {
        const lastKey = findSequentialSibling(currentActiveKey, 2); // Looks forward to end
        if (lastKey) return goToRouteKey(navigate, lastKey, params, navOptions);
      }
    },
    [navigate, currentActiveKey, shouldLoop]
  );

  return {
    navigate,
    buildNavigationPath,
    goNext,
    goBackStep,
    goToRouteKey: useCallback(
      (routeKey, params, navOptions) =>
        goToRouteKey(navigate, routeKey, params, navOptions),
      [navigate]
    ),
    goBackSafe: useCallback(
      (fallbackPath, navOptions) => goBackSafe(navigate, fallbackPath, navOptions),
      [navigate]
    ),
    navigateWithParams: useCallback(
      (routeKeyOrPath, params, navOptions) =>
        navigateWithParams(navigate, routeKeyOrPath, params, navOptions),
      [navigate]
    )
  };
}