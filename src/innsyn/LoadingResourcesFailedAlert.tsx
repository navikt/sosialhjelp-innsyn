import {Alert} from "@navikt/ds-react";
import React, {useEffect} from "react";
import {Trans, useTranslation} from "react-i18next";
import styled from "styled-components";
import {useQueryClient} from "@tanstack/react-query";
import {logServerfeil} from "../utils/amplitude";

const StyledWrapper = styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
`;

const keys: string[] = ["hendelser", "vedlegg", "saksStatus", "oppgaver", "soknadsStatus", "dokumentasjonkrav"];

export const LoadingResourcesFailedAlert = () => {
    const {t} = useTranslation();

    const queryClient = useQueryClient();
    const queries = queryClient.getQueryCache().findAll({
        predicate: (query) => keys.some((key) => (query.queryKey[0] as string).includes(key)),
    });

    const hasError = queries.some((it) => it.state.status === "error");

    useEffect(() => {
        if (hasError) {
            /* Gjør dette for bakoverkompabilitet i amplitude. Burde skrives om så dette kan gjøres der dataen hentes */
            const queryToStatus = keys.map((key) => {
                const query = queries.find((query) => (query.queryKey[0] as string).includes(key));
                return [key, query && query.state.status !== "error" ? "OK" : "FEILET"];
            });
            logServerfeil(Object.fromEntries(queryToStatus));
        }
    }, [queries, hasError]);

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
