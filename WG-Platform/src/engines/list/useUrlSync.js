import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseListQuery } from './useQueryParser.js';
import { translateListStateToQuery } from './useQueryTranslator.js';

export function useUrlSync({
  state,
  setState,
  enabled = true,
  replace = true,
  parser = parseListQuery,
  translator = translateListStateToQuery
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const applyingUrlState = useRef(false);

  useEffect(() => {
    if (!enabled || typeof setState !== 'function') {
      return;
    }

    applyingUrlState.current = true;
    setState(parser(searchParams.toString()));

    queueMicrotask(() => {
      applyingUrlState.current = false;
    });
  }, [enabled, parser, searchParams, setState]);

  useEffect(() => {
    if (!enabled || !state || applyingUrlState.current) {
      return;
    }

    setSearchParams(translator(state), { replace });
  }, [enabled, replace, setSearchParams, state, translator]);

  return searchParams;
}
