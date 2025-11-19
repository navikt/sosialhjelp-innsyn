import { NotePencilDashIcon, FloppydiskIcon } from "@navikt/aksel-icons";
import { useLocale, useTranslations } from "next-intl";

import DigisosLinkCard, { Tag } from "@components/statusCard/DigisosLinkCard";
import { browserEnv } from "@config/env";

interface Props {
    soknadId: string;
    keptUntil: Date;
}

const PaabegyntCard = ({ soknadId, keptUntil }: Props) => {
    const t = useTranslations("StatusCard.PaabegyntCard");
    const locale = useLocale();

    const tags: Tag[] = [
        { title: t("paabegynt"), variant: "neutral-moderate", icon: <NotePencilDashIcon /> },
        { title: t("keptUntil", { date: keptUntil }), variant: "neutral-moderate", icon: <FloppydiskIcon /> },
    ];

    return (
        <DigisosLinkCard
            href={`${browserEnv.NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/soknad/${locale}/skjema/${soknadId}/1`}
            variant="info"
            dashed
            tags={tags}
        >
            {t("title")}
        </DigisosLinkCard>
    );
};

export default PaabegyntCard;
