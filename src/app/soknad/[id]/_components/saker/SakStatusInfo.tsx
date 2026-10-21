import { BodyLong, InfoCard, Link } from "@navikt/ds-react";
import { SaksStatusResponseStatus } from "@generated/model";
import { useLocale, useTranslations } from "next-intl";

interface Props {
    status?: SaksStatusResponseStatus;
    harVedtak: boolean;
}

interface UnderBehandlingInfoProps {
    harVedtak: boolean;
}

const UnderBehandlingInfo = ({ harVedtak }: UnderBehandlingInfoProps) => {
    const t = useTranslations("UnderBehandlingInfo");

    if (harVedtak) {
        return null;
    }

    return (
        <InfoCard data-color="info" size="medium">
            <InfoCard.Message icon={false}>{t("description")}</InfoCard.Message>
        </InfoCard>
    );
};

interface KontaktInfoProps {
    namespace: "IkkeInnsynInfo" | "BehandlesIkkeInfo";
}

const KontaktInfo = ({ namespace }: KontaktInfoProps) => {
    const locale = useLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;
    const t = useTranslations(namespace);

    return (
        <InfoCard data-color="warning">
            <InfoCard.Message icon={false}>
                <BodyLong spacing>{t("description1")}</BodyLong>
                <BodyLong>
                    {t.rich("description2", {
                        navKontorLenke: (chunks) => (
                            <Link inlineText href={`https://www.nav.no/sok-nav-kontor${localeSuffix}`}>
                                {chunks}
                            </Link>
                        ),
                        tlf: (chunks) => (
                            <Link inlineText href="tel:55553333">
                                {chunks}
                            </Link>
                        ),
                    })}
                </BodyLong>
            </InfoCard.Message>
        </InfoCard>
    );
};

const SakStatusInfo = ({ status, harVedtak }: Props) => {
    switch (status ?? "UNDER_BEHANDLING") {
        case "IKKE_INNSYN":
            return <KontaktInfo namespace="IkkeInnsynInfo" />;
        case "BEHANDLES_IKKE":
            return <KontaktInfo namespace="BehandlesIkkeInfo" />;
        case "UNDER_BEHANDLING":
            return <UnderBehandlingInfo harVedtak={harVedtak} />;
        default:
            return null;
    }
};

export default SakStatusInfo;
