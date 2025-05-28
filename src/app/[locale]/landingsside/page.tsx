import { notFound } from "next/navigation";
import { Heading } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getFlag, getToggles } from "../../../featuretoggles/unleash";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_landingsside", await getToggles());
    const t = await getTranslations("common");
    if (!toggle) {
        return notFound();
    }
    return (
        <Heading size="xlarge" className="min-h-[50vh]">
            {t("dineSoknader")}
        </Heading>
    );
};

export default Page;
