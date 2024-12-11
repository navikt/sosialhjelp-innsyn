export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
    const response = await fetch(url, options);
    if (response.status === 204) {
        return [] as T;
    }
    const data: T = await response.json();

    // Trenger å få med statuskode på /tilgang
    if (url.includes("/tilgang")) {
        return {data, status: response.status} as T;
    }

    return data as T;
};
