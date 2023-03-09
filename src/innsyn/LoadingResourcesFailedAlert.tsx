import {Alert} from "@navikt/ds-react";
import React, {useEffect} from "react";
import {Trans, useTranslation} from "react-i18next";
import styled from "styled-components";
import {useQueries} from "@tanstack/react-query";
import {logServerfeil} from "../utils/amplitude";
import {
    getDokumentasjonkrav,
    getGetDokumentasjonkravQueryKey,
    getGetOppgaverQueryKey,
    getOppgaver,
} from "../generated/oppgave-controller/oppgave-controller";
import {getHentHendelserQueryKey, hentHendelser} from "../generated/hendelse-controller/hendelse-controller";
import {getHentVedleggQueryKey, hentVedlegg} from "../generated/vedlegg-controller/vedlegg-controller";
import {
    getHentSaksStatuserQueryKey,
    hentSaksStatuser,
} from "../generated/saks-status-controller/saks-status-controller";
import {
    getHentSoknadsStatusQueryKey,
    hentSoknadsStatus,
} from "../generated/soknads-status-controller/soknads-status-controller";
import useFiksDigisosId from "../hooks/useFiksDigisosId";

const StyledWrapper = styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
`;

const getQueries = (fiksDigisosId: string) => [
    {tag: "hendelser", queryKey: getHentHendelserQueryKey(fiksDigisosId), queryFn: () => hentHendelser(fiksDigisosId)},
    {tag: "vedlegg", queryKey: getHentVedleggQueryKey(fiksDigisosId), queryFn: () => hentVedlegg(fiksDigisosId)},
    {
        tag: "saksStatus",
        queryKey: getHentSaksStatuserQueryKey(fiksDigisosId),
        queryFn: () => hentSaksStatuser(fiksDigisosId),
    },
    {tag: "oppgaver", queryKey: getGetOppgaverQueryKey(fiksDigisosId), queryFn: () => getOppgaver(fiksDigisosId)},
    {
        tag: "soknadsStatus",
        queryKey: getHentSoknadsStatusQueryKey(fiksDigisosId),
        queryFn: () => hentSoknadsStatus(fiksDigisosId),
    },
    {
        tag: "dokumentasjonkrav",
        queryKey: getGetDokumentasjonkravQueryKey(fiksDigisosId),
        queryFn: () => getDokumentasjonkrav(fiksDigisosId),
    },
];

export const LoadingResourcesFailedAlert = () => {
    const {t} = useTranslation();

    const fiksDigisosId = useFiksDigisosId();
    const _queries = getQueries(fiksDigisosId);
    const queries = useQueries({queries: _queries});

    const queriesWithError = queries.filter((query) => query.isError);

    const hasError = queriesWithError.length > 0;

    useEffect(() => {
        if (hasError) {
            /* Gjør dette for bakoverkompabilitet i amplitude. Burde skrives om så dette kan gjøres der dataen hentes */
            const queryToStatus = _queries.map(({tag}, index) => [tag, queries[index].isError ? "FEILET" : "OK"]);
            logServerfeil(Object.fromEntries(queryToStatus));
        }
    }, [queries, _queries, hasError]);

    return (
        <StyledWrapper>
            {hasError && (
                <Alert variant="error" className="luft_over_16px">
                    <Trans t={t} i18nKey="feilmelding.ressurs_innlasting" components={{linebreak: <br />}} />
                </Alert>
            )}
        </StyledWrapper>
    );
};
