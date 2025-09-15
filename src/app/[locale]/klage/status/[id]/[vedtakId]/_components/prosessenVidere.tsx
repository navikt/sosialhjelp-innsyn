import { Heading } from "@navikt/ds-react";
import { Process, ProcessEvent } from "@navikt/ds-react/Process";
import { getTranslations } from "next-intl/server";

const ProsessenVidere = async () => {
    const t = await getTranslations("KlageProsessenVidere");

    return (
        <div>
            <Heading size="medium" level="2" className="mb-4">
                {t("tittel")}
            </Heading>
            <Process>
                <ProcessEvent title={t("steg1.tittel")} bullet={1} />
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
