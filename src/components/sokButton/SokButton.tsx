import { PencilIcon } from "@navikt/aksel-icons";
import { getTranslations } from "next-intl/server";

import { getServerEnv } from "@config/env";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const SokButton = async () => {
    const t = await getTranslations("SokButton");
    return (
        <DigisosLinkCard href={`${getServerEnv().NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/soknad`} icon={<PencilIcon />}>
            {t("sokOmSosialhjelp")}
        </DigisosLinkCard>
    );
};

export default SokButton;
