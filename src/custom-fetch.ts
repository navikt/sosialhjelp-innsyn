export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
    const response = await fetch(url, options);
    if (response.status === 204) {
        return [] as T;
    }
    const data: T = await response.json();

    return data as T;
};
