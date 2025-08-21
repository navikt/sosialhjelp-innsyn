import { getTranslations } from "next-intl/server";
import React from "react";
import { BodyLong, BodyShort, Link } from "@navikt/ds-react";

import StatusAlert from "@components/alert/StatusAlert";
import { SoknadsStatusResponseStatus } from "@generated/ssr/model";

interface Props {
    navKontor?: string;
    soknadstatus: SoknadsStatusResponseStatus;
}

const InfoAlert = async ({ soknadstatus, navKontor }: Props) => {
    const t = await getTranslations("InfoAlert");
    // TODO: Inkluder Mottatt her også. Se design for egen alert
    if (soknadstatus === "SENDT") {
        return (
            <StatusAlert
                variant="success"
                tittel={t.rich(`SENDT.tittel`, {
                    navKontor: navKontor ?? "et Nav-kontor",
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                })}
                beskrivelse={t(`SENDT.beskrivelse`)}
            />
        );
    }
    if (soknadstatus === "MOTTATT") {
        return (
            <StatusAlert
                variant="info"
                tittel={t("MOTTATT.tittel")}
                beskrivelse={
                    <>
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
                    </>
                }
            />
        );
    }
    return null;
};

export default InfoAlert;
