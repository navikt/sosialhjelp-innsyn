import * as React from "react";
import { useTranslation } from "next-i18next";
import { Alert, Label } from "@navikt/ds-react";
import styled from "styled-components";

import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import useKommune from "../../hooks/useKommune";

import { getDriftsmeldingByKommuneResponseOrDigisosId } from "./DriftsmeldingUtilities";

const StyledAlert = styled(Alert)`
    margin-bottom: 1rem;
`;

const DriftsmeldingAlertstripe = () => {
    const { kommune } = useKommune();

    const { t } = useTranslation();

    const driftsmelding = getDriftsmeldingByKommuneResponseOrDigisosId(kommune);
    const Tidspunkt = () => (
        <Label as="p">
            <DatoOgKlokkeslett
                bareDato={false}
                tidspunkt={kommune ? (kommune.tidspunkt ? kommune.tidspunkt.toString() : "") : ""}
            />
        </Label>
    );

    switch (driftsmelding?.type) {
        case "InnsynDeaktivert":
        case "EttersendelseDeaktivert":
        case "InnsynOgEttersendelseDeaktivert":
            return (
                <StyledAlert variant="error">
                    <Tidspunkt />
                    {t(driftsmelding.textKey)}
                </StyledAlert>
            );
        case "FeiledeDigisosIder":
            return <StyledAlert variant="error">{t(driftsmelding.textKey)}</StyledAlert>;
        default:
            return null;
    }
};

export default DriftsmeldingAlertstripe;
