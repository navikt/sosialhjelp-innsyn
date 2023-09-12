import * as React from "react";
import {useTranslation} from "next-i18next";
import {getDriftsmeldingByKommuneResponseOrDigisosId} from "./DriftsmeldingUtilities";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {Alert, Label} from "@navikt/ds-react";
import styled from "styled-components";
import useKommune from "../../hooks/useKommune";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";

const StyledAlert = styled(Alert)`
    margin-bottom: 1rem;
`;

const DriftsmeldingAlertstripe: React.FC = () => {
    const {kommune} = useKommune();
    const fiksDigisosId = useFiksDigisosId();

    const {t} = useTranslation();

    const driftsmelding = getDriftsmeldingByKommuneResponseOrDigisosId(kommune, fiksDigisosId);
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
