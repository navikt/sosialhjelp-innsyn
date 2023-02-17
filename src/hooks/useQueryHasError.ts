import {QueryKey, useQueryClient} from "@tanstack/react-query";

const useQueryHasError = (queryKey: QueryKey) => {
    const queryClient = useQueryClient();
    return queryClient.getQueryCache().find(queryKey)?.state.status === "error";
};

export default useQueryHasError;
