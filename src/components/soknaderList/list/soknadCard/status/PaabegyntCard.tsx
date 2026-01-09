import { NotePencilDashIcon, CalendarIcon } from "@navikt/aksel-icons";
import { useLocale, useTranslations } from "next-intl";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";
import { Tag } from "@navikt/ds-react";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { browserEnv } from "@config/env";

interface Props {
    soknadId: string;
    keptUntil: Date;
}

const PaabegyntCard = ({ soknadId, keptUntil }: Props) => {
    const t = useTranslations("PaabegyntCard");
    const locale = useLocale();

    return (
        <DigisosLinkCard
            href={`${browserEnv.NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/soknad/${locale}/skjema/${soknadId}/1`}
            footer={
                <LinkCardFooter>
                    <Tag
                        key="paabegynt"
                        variant="neutral-moderate"
                        icon={<NotePencilDashIcon aria-hidden="true" />}
                        size="small"
                    >
                        {t("utkast")}
                    </Tag>

                    <Tag
                        key="keptUntil"
                        variant="neutral-moderate"
                        icon={<CalendarIcon aria-hidden="true" />}
                        size="small"
                    >
                        {t("keptUntil", { date: keptUntil })}
                    </Tag>
                </LinkCardFooter>
            }
        >
            <span className="sr-only">{t("utkast") + " "}</span>
            {t("title")}
        </DigisosLinkCard>
    );
};

export default PaabegyntCard;
