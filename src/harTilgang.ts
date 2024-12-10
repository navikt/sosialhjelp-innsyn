import type {TilgangResponse} from "./generated/model";

const getHarTilgangUrl = () => {
    return `/sosialhjelp/innsyn/api/innsyn-api/api/v1/innsyn/tilgang`;
};

const harTilgang = async (url: string, options?: RequestInit): Promise<TilgangResponse & {status: number}> => {
    const res = await fetch(url, options);
    const data: TilgangResponse = await res.json();

    return {...data, status: res.status};
};

const getHarTilgangQueryKey = () => {
    return [`/sosialhjelp/innsyn/api/innsyn-api/api/v1/innsyn/tilgang`] as const;
};

export default harTilgang;
