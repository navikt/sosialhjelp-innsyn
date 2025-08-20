import { getTranslations } from "next-intl/server";
import React from "react";

import StatusAlert from "@components/alert/StatusAlert";
import { SoknadsStatusResponseStatus } from "@generated/ssr/model";

interface Props {
    navKontor?: string;
    soknadstatus: SoknadsStatusResponseStatus;
}

const InfoAlert = async ({ soknadstatus, navKontor }: Props) => {
    const t = await getTranslations("InfoAlert");
    // TODO: Inkluder Mottatt her også. Se design for egen alert
    if (!["SENDT"].includes(soknadstatus)) {
        return null;
    }
    return (
        <StatusAlert
            variant="success"
            tittel={t.rich(`${soknadstatus}.tittel`, {
                navKontor: navKontor ?? "et Nav-kontor",
                norsk: (chunks) => <span lang="no">{chunks}</span>,
            })}
            beskrivelse={t(`${soknadstatus}.beskrivelse`)}
        />
    );
};

export default InfoAlert;
