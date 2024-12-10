export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
    const response = await fetch(url, options);
    if (response.status === 204) {
        return [] as T;
    }
    const data: T = await response.json();

    console.log("custom fetch url: ", url);
    if (url.includes("harTilgang")) {
        console.log("returnerer custom boio", {data, status: response.status});
        return {data, status: response.status} as T;
    }

    return data as T;
};
