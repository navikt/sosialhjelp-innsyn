import { HouseIcon } from "@navikt/aksel-icons";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { getTranslations } from "next-intl/server";

const LandingssideSnarvei = async () => {
    const t = await getTranslations("Snarveier");
    return (
        <DigisosLinkCard href="/" icon={<HouseIcon aria-hidden />}>
            {t("landingsside")}
        </DigisosLinkCard>
    );
};

export default LandingssideSnarvei;
