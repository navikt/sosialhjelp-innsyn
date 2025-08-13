import { BodyShort, Heading, Tag, VStack } from "@navikt/ds-react";
import { BankNoteIcon, FilePdfIcon } from "@navikt/aksel-icons";
import { getTranslations } from "next-intl/server";

import StatusCard from "@components/statusCard/StatusCard";

import { FilUrl, SaksStatusResponseUtfallVedtak } from "../../generated/ssr/model";

interface Props {
    tittel: string;
    beskrivelse: string;
    vedtaksfilUrlList: FilUrl[] | undefined;
    utfallVedtak?: SaksStatusResponseUtfallVedtak;
    utfallVedtakStatus?: string;
}

export const VedtakUtfall = async ({
    tittel,
    beskrivelse,
    vedtaksfilUrlList,
    utfallVedtak,
    utfallVedtakStatus,
}: Props) => {
    const t = await getTranslations("StatusVedtak");

    const boxColor = (utfallVedtak?: SaksStatusResponseUtfallVedtak) => {
        if (utfallVedtak === "INNVILGET") {
            return "success-moderate";
        }
        if (utfallVedtak === "DELVIS_INNVILGET") {
            return "warning-moderate";
        }
        if (utfallVedtak === "AVVIST" || utfallVedtak === "AVSLATT") {
            return "error-moderate";
        }
        return "info-moderate";
    };

    return (
        <VStack gap="space-16">
            <Heading size="xlarge" level="1">
                {tittel}
            </Heading>
            <Tag variant={boxColor(utfallVedtak)} className="size-fit">
                <BodyShort>
                    {t.rich("status", {
                        vedtak: (chunks) => <b>{chunks}</b>,
                        status: utfallVedtakStatus || "",
                        b: (chunks) => <b>{chunks}</b>,
                        norsk: (chunks) => <span lang="no">{chunks}</span>,
                    })}
                </BodyShort>
            </Tag>
            <div>{beskrivelse}</div>

            {vedtaksfilUrlList &&
                vedtaksfilUrlList.map((fil, index) => (
                    <StatusCard
                        downloadIcon={true}
                        key={index}
                        href={fil.url}
                        icon={<FilePdfIcon />}
                        description={fil.dato}
                    >
                        Last ned vedtaksbrev
                    </StatusCard>
                ))}
            <StatusCard downloadIcon={false} href="/utbetaling" icon={<BankNoteIcon />}>
                Se kommende utbetaling
            </StatusCard>
        </VStack>
    );
};
