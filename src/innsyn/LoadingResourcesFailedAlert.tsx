import { Alert } from "@navikt/ds-react";
import React from "react";
import { Trans, useTranslation } from "next-i18next";
import styled from "styled-components";
import { useQueries } from "@tanstack/react-query";

import {
    getDokumentasjonkrav,
    getGetDokumentasjonkravQueryKey,
    getGetOppgaverQueryKey,
    getOppgaver,
} from "../generated/oppgave-controller/oppgave-controller";
import { getHentHendelserQueryKey, hentHendelser } from "../generated/hendelse-controller/hendelse-controller";
import { getHentVedleggQueryKey, hentVedlegg } from "../generated/vedlegg-controller/vedlegg-controller";
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
    {
        tag: "hendelser",
        queryKey: getHentHendelserQueryKey(fiksDigisosId),
        queryFn: () => hentHendelser(fiksDigisosId),
        enabled: false,
    },
    {
        tag: "vedlegg",
        queryKey: getHentVedleggQueryKey(fiksDigisosId),
        queryFn: () => hentVedlegg(fiksDigisosId),
        enabled: false,
    },
    {
        tag: "saksStatus",
        queryKey: getHentSaksStatuserQueryKey(fiksDigisosId),
        queryFn: () => hentSaksStatuser(fiksDigisosId),
        enabled: false,
    },
    {
        tag: "oppgaver",
        queryKey: getGetOppgaverQueryKey(fiksDigisosId),
        queryFn: () => getOppgaver(fiksDigisosId),
        enabled: false,
    },
    {
        tag: "soknadsStatus",
        queryKey: getHentSoknadsStatusQueryKey(fiksDigisosId),
        queryFn: () => hentSoknadsStatus(fiksDigisosId),
        enabled: false,
    },
    {
        tag: "dokumentasjonkrav",
        queryKey: getGetDokumentasjonkravQueryKey(fiksDigisosId),
        queryFn: () => getDokumentasjonkrav(fiksDigisosId),
        enabled: false,
    },
];

export const LoadingResourcesFailedAlert = () => {
    const { t } = useTranslation();

    const fiksDigisosId = useFiksDigisosId();
    const _queries = getQueries(fiksDigisosId);
    const queries = useQueries({ queries: _queries });

    const queriesWithError = queries.filter((query) => query.isError);

    const hasError = queriesWithError.length > 0;

    return (
        <StyledWrapper>
            {hasError && (
                <Alert variant="error">
                    <Trans t={t} i18nKey="feilmelding.ressurs_innlasting" components={{ linebreak: <br /> }} />
                </Alert>
            )}
        </StyledWrapper>
    );
};
