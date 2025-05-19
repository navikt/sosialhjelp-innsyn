import { notFound } from "next/navigation";
import { Heading } from "@navikt/ds-react";
import { Locale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { getFlagServerSide } from "../featureTogglesServerSide";

interface Props {
    params: Promise<{
        locale: Locale;
    }>;
}

const Landingsside = ({ params }: Props) => {
    const toggle = use(getFlagServerSide("sosialhjelp.innsyn.ny_landingsside"));
    const { locale } = use(params);
    setRequestLocale(locale);
    const t = useTranslations("common");
    if (!toggle) {
        return notFound();
    }
    return <Heading size="xlarge">{t("dineSoknader")}</Heading>;
};

export default Landingsside;
