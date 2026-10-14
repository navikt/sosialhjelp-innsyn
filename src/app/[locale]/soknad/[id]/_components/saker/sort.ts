import { SaksStatusResponse, VedtakDto } from "@generated/model";

export const sortVedtak = (vedtak: VedtakDto[]): VedtakDto[] =>
    vedtak.toSorted((a, b) => {
        const dateA = a.dato ? new Date(a.dato).getTime() : 0;
        const dateB = b.dato ? new Date(b.dato).getTime() : 0;
        return dateB - dateA;
    });

export const sortSaker = (saker: SaksStatusResponse[]) =>
    saker.toSorted((a, b) => Number(b.vedtak.length > 0) - Number(a.vedtak.length > 0));
