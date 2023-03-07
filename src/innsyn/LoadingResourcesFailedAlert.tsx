import {Alert} from "@navikt/ds-react";
import React, {useEffect} from "react";
import {logServerfeil} from "../utils/amplitude";
import {Trans, useTranslation} from "react-i18next";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";

const StyledWrapper = styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
`;

const restStatusError = (restStatus: REST_STATUS): boolean => {
    return (
        restStatus !== REST_STATUS.INITIALISERT && restStatus !== REST_STATUS.PENDING && restStatus !== REST_STATUS.OK
    );
};

export const LoadingResourcesFailedAlert = () => {
    const {t} = useTranslation();

    const {soknadsStatus, oppgaver, vilkar, dokumentasjonkrav, hendelser, vedlegg} = useSelector(
        (state: InnsynAppState) => state.innsynsdata.restStatus
    );
    const hasError =
        restStatusError(soknadsStatus) ||
        restStatusError(oppgaver) ||
        restStatusError(vilkar) ||
        restStatusError(dokumentasjonkrav) ||
        restStatusError(hendelser) ||
        restStatusError(vedlegg);

    useEffect(() => {
        if (hasError) {
            logServerfeil({soknadsStatus, oppgaver, vilkar, dokumentasjonkrav, hendelser, vedlegg});
        }
    }, [soknadsStatus, oppgaver, vilkar, dokumentasjonkrav, hendelser, vedlegg, hasError]);

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
