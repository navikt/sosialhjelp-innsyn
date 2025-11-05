"use client";

import React, { use } from "react";
import { useTranslations } from "next-intl";

import { SaksStatusResponse } from "@generated/model";
import StatusAlert from "@components/alert/StatusAlert";
import { SoknadsStatusResponseStatus } from "@generated/ssr/model";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
    status: Exclude<SoknadsStatusResponseStatus, "MOTTATT" | "SENDT">;
}

// Hvis det bare er én sak skal statusen vises i info-boks på toppen.
const SoknadStatusAlert = ({ sakerPromise, status }: Props): React.JSX.Element | null => {
    const t = useTranslations("SoknadStatusAlert");
    const saker = use(sakerPromise);
    if (saker.length > 1) {
        return null;
    }
    return <StatusAlert variant="info" tittel={t(`tittel.${status}`)} beskrivelse={t(`beskrivelse.${status}`)} />;
};

export default SoknadStatusAlert;
