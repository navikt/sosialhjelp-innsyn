"use client";

import { Heading } from "@navikt/ds-react";
import React, { use } from "react";
import { useTranslations } from "next-intl";

import { SaksStatusResponse } from "@generated/model";
import AlertWithCloseButton from "@components/alert/AlertWithCloseButton";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
}

const DeltSoknadAlert = ({ sakerPromise }: Props) => {
    const t = useTranslations("DeltSoknadAlert");
    const saker = use(sakerPromise);

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
