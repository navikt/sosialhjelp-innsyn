import * as React from "react";
import { useTranslation } from "next-i18next";
import { Alert, Label } from "@navikt/ds-react";
import styled from "styled-components";

import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import useKommune from "../../hooks/useKommune";

import { getDriftsmeldingByKommune } from "./getDriftsmeldingByKommune";

const StyledAlert = styled(Alert)`
    margin-bottom: 1rem;
`;

const DriftsmeldingAlertstripe = () => {
    const { kommune } = useKommune();

    const { t } = useTranslation();

    const driftsmelding = getDriftsmeldingByKommune(kommune);

    if (!driftsmelding) return null;

    return (
        <StyledAlert variant="error">
            <Label as="p">
                <DatoOgKlokkeslett
                    bareDato={false}
                    tidspunkt={kommune ? (kommune.tidspunkt ? kommune.tidspunkt.toString() : "") : ""}
                />
            </Label>
            {t(driftsmelding)}
        </StyledAlert>
    );
};

export default DriftsmeldingAlertstripe;
