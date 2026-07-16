import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePlatformApi } from "../../providers/ApiProvider.jsx";

export function useApi({
    queryKey,
    url,
    method = "GET",
    params,
    data,
    headers,
    enabled = true,

    staleTime = 0,
    gcTime,
    retry = 1,
    refetchOnWindowFocus = false,
    refetchOnReconnect = true,
    refetchOnMount = true,
    refetchInterval = false,

    select,
    placeholderData,
    initialData,

    responseType,
    mode,
    successMessage,

    queryFn
}) {

    const api = usePlatformApi();

    const resolvedQueryFn = useMemo(() => {

        if (queryFn) {
            return queryFn;
        }

        return () =>
            api.request({

                method,

                url,

                params,

                data,

                headers,

                responseType,

                mode,

                successMessage

            });

    }, [
        api,
        queryFn,
        method,
        url,
        params,
        data,
        headers,
        responseType,
        mode,
        successMessage
    ]);

    return useQuery({

        queryKey,

        queryFn: resolvedQueryFn,

        enabled,

        staleTime,

        gcTime,

        retry,

        refetchOnWindowFocus,

        refetchOnReconnect,

        refetchOnMount,

        refetchInterval,

        select,

        placeholderData,

        initialData

    });

}