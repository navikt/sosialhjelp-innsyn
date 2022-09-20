import * as React from "react";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import {Driftsmelding, DriftsmeldingTypeKeys, getDriftsmeldingByKommuneResponse} from "./DriftsmeldingUtilities";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {Alert, Label} from "@navikt/ds-react";
import styled from "styled-components";

const StyledAlert = styled(Alert)`
    margin-bottom: 1rem;
`;

const DriftsmeldingAlertstripe: React.FC<{}> = () => {
    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );

    const driftsmelding: Driftsmelding = getDriftsmeldingByKommuneResponse(kommuneResponse);
    const Tidspunkt = () => (
        <Label as="p">
            <DatoOgKlokkeslett
                bareDato={false}
                tidspunkt={
                    kommuneResponse ? (kommuneResponse.tidspunkt ? kommuneResponse.tidspunkt.toString() : "") : ""
                }
            />
        </Label>
    );

    switch (driftsmelding.type) {
        case DriftsmeldingTypeKeys.DRIFTSMELDING_ETTERSENDELSE_DEAKTIVERT:
        case DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_DEAKTIVERT:
        case DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_OG_ETTERSENDELSE_DEAKTIVERT:
            return (
                <StyledAlert variant="error">
                    <Tidspunkt />
                    <FormattedMessage id={driftsmelding.textKey} />
                </StyledAlert>
            );
        case DriftsmeldingTypeKeys.DRIFTSMELDING_INGEN:
        default:
            return null;
    }
};

export default DriftsmeldingAlertstripe;
