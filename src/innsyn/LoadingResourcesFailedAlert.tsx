import {Alert} from "@navikt/ds-react";
import React, {useEffect, useState} from "react";
import {logServerfeil} from "../utils/amplitude";
import {FormattedMessage} from "react-intl";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";

const StyledWrapper = styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
`;

const restStatusSjekk = (restStatus: REST_STATUS): boolean => {
    return (
        restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING || restStatus === REST_STATUS.OK
    );
};

export const LoadingResourcesFailedAlert = () => {
    const {soknadsStatus, oppgaver, vilkar, dokumentasjonkrav, hendelser, vedlegg} = useSelector(
        (state: InnsynAppState) => state.innsynsdata.restStatus
    );
    const [loadingResourcesFailed, setLoadingResourcesFailed] = useState(false);

    useEffect(() => {
        if (
            !restStatusSjekk(soknadsStatus) ||
            !restStatusSjekk(oppgaver) ||
            !restStatusSjekk(vilkar) ||
            !restStatusSjekk(dokumentasjonkrav) ||
            !restStatusSjekk(hendelser) ||
            !restStatusSjekk(vedlegg)
        ) {
            logServerfeil({soknadsStatus, oppgaver, vilkar, dokumentasjonkrav, hendelser, vedlegg});
            setLoadingResourcesFailed(true);
        }
    }, [soknadsStatus, oppgaver, vilkar, dokumentasjonkrav, hendelser, vedlegg]);

    return (
        <StyledWrapper>
            {loadingResourcesFailed && (
                <Alert variant="error" className="luft_over_16px">
                    <FormattedMessage id={"feilmelding.ressurs_innlasting"} values={{linebreak: <br />}} />
                </Alert>
            )}
        </StyledWrapper>
    );
};
