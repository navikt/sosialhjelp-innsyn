import * as React from "react";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import {Driftsmelding, DriftsmeldingTypeKeys, getDriftsmeldingByKommuneResponse} from "./DriftsmeldingUtilities";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import Element from "nav-frontend-typografi/lib/element";
import {Alert} from "@navikt/ds-react";
import styled from "styled-components";

const StyledAlert = styled(Alert)`
    margin-bottom: 1rem;
`;

const DriftsmeldingAlertstripe: React.FC<{}> = () => {
    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );

    const driftsmelding: Driftsmelding = getDriftsmeldingByKommuneResponse(kommuneResponse);
    const tidspunkt = (
        <Element>
            <DatoOgKlokkeslett
                bareDato={false}
                tidspunkt={
                    kommuneResponse ? (kommuneResponse.tidspunkt ? kommuneResponse.tidspunkt.toString() : "") : ""
                }
            />
        </Element>
    );
    switch (driftsmelding.type) {
        case DriftsmeldingTypeKeys.DRIFTSMELDING_ETTERSENDELSE_DEAKTIVERT: {
            return (
                <StyledAlert variant="error">
                    {tidspunkt}
                    <FormattedMessage id={driftsmelding.textKey} />
                </StyledAlert>
            );
        }
        case DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_DEAKTIVERT: {
            return (
                <StyledAlert variant="error">
                    {tidspunkt}
                    <FormattedMessage id={driftsmelding.textKey} />
                </StyledAlert>
            );
        }
        case DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_OG_ETTERSENDELSE_DEAKTIVERT: {
            return (
                <StyledAlert variant="error">
                    {tidspunkt}
                    <FormattedMessage id={driftsmelding.textKey} />
                </StyledAlert>
            );
        }
        case DriftsmeldingTypeKeys.DRIFTSMELDING_INGEN: {
            return null;
        }
        default: {
            return null;
        }
    }
};

export default DriftsmeldingAlertstripe;
