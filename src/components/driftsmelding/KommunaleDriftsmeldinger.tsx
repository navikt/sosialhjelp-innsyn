import * as React from "react";
import { useTranslation } from "next-i18next";
import { Alert, Label } from "@navikt/ds-react";
import styled from "styled-components";

import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import { KommuneResponse } from "../../generated/model";

import { getDriftsmeldingByKommune } from "./getDriftsmeldingByKommune";

const StyledAlert = styled(Alert)`
    margin-bottom: 1rem;
`;

export const KommunaleDriftsmeldinger = ({ kommune }: { kommune: KommuneResponse | undefined }) => {
    const { t } = useTranslation();

    const driftsmelding = getDriftsmeldingByKommune(kommune);

    if (!driftsmelding) return null;

    return (
        <StyledAlert variant="error">
            <Label as="p">
                <DatoOgKlokkeslett tidspunkt={kommune?.tidspunkt?.toString() || ""} />
            </Label>
            {t(driftsmelding)}
        </StyledAlert>
    );
};
