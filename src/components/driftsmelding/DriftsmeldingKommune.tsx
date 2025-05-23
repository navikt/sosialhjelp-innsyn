import * as React from "react";
import { useTranslations } from "next-intl";
import { Alert, Label } from "@navikt/ds-react";

import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";

import { KommuneDriftsmeldingError } from "./lib/getDriftsmeldingFromKommune";

export const DriftsmeldingKommune = ({ driftsmelding }: { driftsmelding: KommuneDriftsmeldingError | undefined }) => {
    const t = useTranslations("common");

    return !driftsmelding ? null : (
        <Alert className="mb-4" variant="error">
            <Label as="p">
                <DatoOgKlokkeslett tidspunkt={new Date().toISOString()} />
            </Label>
            {t(driftsmelding)}
        </Alert>
    );
};
