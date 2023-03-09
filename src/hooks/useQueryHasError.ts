import {QueryKey, useQuery} from "@tanstack/react-query";

const useQueryHasError = (queryKey: QueryKey) => {
    return useQuery(queryKey).isError;
};

export default useQueryHasError;
