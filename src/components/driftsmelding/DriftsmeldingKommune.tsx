import * as React from "react";
import { useTranslation } from "next-i18next";
import { Alert, Label } from "@navikt/ds-react";

import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import { KommuneResponse } from "../../generated/model";

import { getDriftsmeldingFromKommune } from "./lib/getDriftsmeldingFromKommune";

export const DriftsmeldingKommune = ({ kommune }: { kommune: KommuneResponse | undefined }) => {
    const { t } = useTranslation();

    const driftsmelding = getDriftsmeldingFromKommune(kommune);

    if (!driftsmelding) return null;

    return (
        <Alert className="mb-4" variant="error">
            <Label as="p">
                <DatoOgKlokkeslett tidspunkt={new Date().toISOString()} />
            </Label>
            {t(driftsmelding)}
        </Alert>
    );
};
