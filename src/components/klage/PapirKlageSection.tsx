import { Link as AkselLink } from "@navikt/ds-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { browserEnv } from "../../config/env";
import Panel from "../panel/Panel";

const PapirKlageSection = () => {
    const t = useTranslations("common");

    return (
        <Panel header={t("klage.papirskjema.header")}>
            <p>{t("klage.papirskjema.sammendrag")}</p>
            <p>
                <span>{t("klage.papirskjema.beskrivelse_1")}</span>
                <AkselLink href={`${browserEnv.NEXT_PUBLIC_BASE_PATH}/papirskjema_klage.pdf`}>
                    {t("klage.papirskjema.skjema_url_tekst")}
                </AkselLink>
                <span>{t("klage.papirskjema.beskrivelse_2")}</span>
            </p>
            <p>
                <AkselLink as={Link} href="https://www.nav.no/okonomisk-sosialhjelp#klage">
                    {t("klage.papirskjema.mer_info_url_tekst")}
                </AkselLink>
            </p>
        </Panel>
    );
};

export default PapirKlageSection;
