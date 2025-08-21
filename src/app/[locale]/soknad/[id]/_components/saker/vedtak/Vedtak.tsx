import { BankNoteIcon, FilePdfIcon } from "@navikt/aksel-icons";
import { BodyShort, Link, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { FilUrl, SaksStatusResponseUtfallVedtak } from "@generated/model";
import StatusAlert from "@components/alert/StatusAlert";

interface Props {
    vedtakUtfall: SaksStatusResponseUtfallVedtak;
    vedtaksliste?: FilUrl[];
}

const Vedtak = ({ vedtakUtfall, vedtaksliste }: Props) => {
    const t = useTranslations("Vedtak");
    const isInnvilget = ["INNVILGET", "DELVIS_INNVILGET"].includes(vedtakUtfall);
    return (
        <VStack gap="2">
            <BodyShort>{t(`beskrivelse.${vedtakUtfall}`)}</BodyShort>
            {vedtaksliste &&
                vedtaksliste.map((fil, index) => (
                    <DigisosLinkCard
                        downloadIcon={true}
                        key={index}
                        href={fil.url}
                        icon={<FilePdfIcon />}
                        description={fil.dato}
                    >
                        {t("vedtaksBrev")}
                    </DigisosLinkCard>
                ))}
            {isInnvilget && (
                <DigisosLinkCard href="/utbetaling" icon={<BankNoteIcon />}>
                    {t("kommendeUtbetaling")}
                </DigisosLinkCard>
            )}
            <StatusAlert
                variant="info"
                tittel={t("uenig.tittel")}
                beskrivelse={t.rich("uenig.beskrivelse", {
                    lenke: (chunks) => (
                        <Link href="https://www.nav.no/klagerettigheter" inlineText>
                            {chunks}
                        </Link>
                    ),
                })}
            />
        </VStack>
    );
};

export default Vedtak;
