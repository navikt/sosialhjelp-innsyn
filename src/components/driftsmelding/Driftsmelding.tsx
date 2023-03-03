import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Driftsmelding, DriftsmeldingTypeKeys, getDriftsmeldingByKommuneResponse} from "./DriftsmeldingUtilities";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {Alert, Label} from "@navikt/ds-react";
import styled from "styled-components";
import useKommune from "../../hooks/useKommune";

const StyledAlert = styled(Alert)`
    margin-bottom: 1rem;
`;

const DriftsmeldingAlertstripe: React.FC = () => {
    const {kommune} = useKommune();

    const driftsmelding: Driftsmelding = getDriftsmeldingByKommuneResponse(kommune);
    const Tidspunkt = () => (
        <Label as="p">
            <DatoOgKlokkeslett
                bareDato={false}
                tidspunkt={kommune ? (kommune.tidspunkt ? kommune.tidspunkt.toString() : "") : ""}
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
