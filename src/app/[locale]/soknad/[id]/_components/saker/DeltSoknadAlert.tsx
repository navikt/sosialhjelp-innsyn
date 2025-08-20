import { Heading } from "@navikt/ds-react";
import React from "react";
import { useTranslations } from "next-intl";

import { SaksStatusResponse } from "@generated/model";
import AlertWithCloseButton from "@components/alert/AlertWithCloseButton";

interface Props {
    saker: SaksStatusResponse[];
}

const DeltSoknadAlert = ({ saker }: Props) => {
    const t = useTranslations("DeltSoknadAlert");

    if (saker.length < 2) {
        return null;
    }
    return (
        <AlertWithCloseButton variant="info">
            <Heading size="small">{t("tittel")}</Heading>
            {t("beskrivelse")}
        </AlertWithCloseButton>
    );
};

export default DeltSoknadAlert;
