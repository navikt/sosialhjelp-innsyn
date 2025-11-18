import { getTranslations } from "next-intl/server";
import React from "react";
import { BodyLong, BodyShort, Link } from "@navikt/ds-react";

import StatusAlert from "@components/alert/StatusAlert";
import { SoknadsStatusResponseStatus } from "@generated/ssr/model";
import { SaksStatusResponse } from "@generated/model";

import SoknadStatusAlert from "./SoknadStatusAlert";

interface Props {
    navKontor?: string;
    soknadstatus: SoknadsStatusResponseStatus;
    sakerPromise?: false | Promise<SaksStatusResponse[]>;
}

const InfoAlert = async ({ soknadstatus, navKontor, sakerPromise }: Props) => {
    const t = await getTranslations("InfoAlert");
    if (soknadstatus === "SENDT") {
        return (
            <StatusAlert
                variant="success"
                tittel={t.rich(`SENDT.tittel`, {
                    navKontor: navKontor ?? "et Nav-kontor",
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                })}
            >
                {t(`SENDT.beskrivelse`)}
            </StatusAlert>
        );
    }
    if (soknadstatus === "MOTTATT") {
        return (
            <StatusAlert variant="info" tittel={t("MOTTATT.tittel")}>
                <BodyLong spacing>
                    {t.rich(`MOTTATT.beskrivelse`, {
                        lenke: (chunks) => (
                            <Link href="https://www.nav.no/okonomisk-sosialhjelp#melde" inlineText>
                                {chunks}
                            </Link>
                        ),
                    })}
                </BodyLong>
                <BodyShort>
                    {t.rich("MOTTATT.beskrivelse2", {
                        tel: (chunks) => (
                            <Link href="tel:55553333" inlineText>
                                {chunks}
                            </Link>
                        ),
                    })}
                </BodyShort>
            </StatusAlert>
        );
    }
    if (sakerPromise) {
        return <SoknadStatusAlert sakerPromise={sakerPromise} status={soknadstatus} />;
    }
    return null;
};

export default InfoAlert;
