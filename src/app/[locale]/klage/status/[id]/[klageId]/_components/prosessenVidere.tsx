import { Heading, Link } from "@navikt/ds-react";
import { Process, ProcessEvent } from "@navikt/ds-react/Process";
import { getFormatter, getTranslations } from "next-intl/server";

import { VedleggResponse } from "@generated/model";

type Props = {
    klagePdf: VedleggResponse;
};

const ProsessenVidere = async ({ klagePdf }: Props) => {
    const t = await getTranslations("KlageProsessenVidere");
    const format = await getFormatter();

    const klageSentDate = new Date(klagePdf.datoLagtTil);

    return (
        <div>
            <Heading size="medium" level="2" className="mb-4">
                {t("tittel")}
            </Heading>
            <Process>
                <ProcessEvent title={t("steg1.tittel")} bullet={1} timestamp={format.dateTime(klageSentDate, "long")}>
                    <Link href={klagePdf.url} target="_blank" rel="noopener noreferrer">
                        {t("steg1.visKlagen")}
                    </Link>
                </ProcessEvent>
                <ProcessEvent title={t("steg2.tittel")} bullet={2}>
                    {t("steg2.beskrivelse")}
                </ProcessEvent>
                <ProcessEvent title={t("steg3.tittel")} bullet={2}>
                    {t("steg3.beskrivelse")}
                </ProcessEvent>
            </Process>
        </div>
    );
};

export default ProsessenVidere;
