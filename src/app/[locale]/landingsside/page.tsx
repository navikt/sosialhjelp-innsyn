import { notFound } from "next/navigation";
import { Heading } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { use } from "react";

import { getFlagServerSide } from "../featureTogglesServerSide";

const Page = () => {
    const toggle = use(getFlagServerSide("sosialhjelp.innsyn.ny_landingsside"));
    const t = useTranslations("common");
    if (!toggle) {
        return notFound();
    }
    return <Heading size="xlarge">{t("dineSoknader")}</Heading>;
};

export default Page;
