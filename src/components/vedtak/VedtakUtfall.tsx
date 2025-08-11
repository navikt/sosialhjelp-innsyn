import { BodyShort, BoxNew, Heading, VStack } from "@navikt/ds-react";
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
            return "success-soft";
        }
        if (utfallVedtak === "DELVIS_INNVILGET") {
            return "warning-soft";
        }
        if (utfallVedtak === "AVVIST") {
            return "danger-soft";
        }
        if (utfallVedtak === "AVSLATT") {
            return "danger-soft";
        }
    };

    const textColor = (utfallVedtak?: SaksStatusResponseUtfallVedtak) => {
        if (utfallVedtak === "INNVILGET") {
            return "text-blue-900";
        }
        if (utfallVedtak === "DELVIS_INNVILGET") {
            return "text-orange-900";
        }
        if (utfallVedtak === "AVVIST" || utfallVedtak === "AVSLATT") {
            return "text-red-900";
        }
    };

    return (
        <VStack gap="2">
            <Heading size="xlarge" level="1">
                {tittel}
            </Heading>
            <BoxNew
                background={boxColor(utfallVedtak)}
                className={`box-border size-fit  p-2 rounded-md ${textColor(utfallVedtak)}`}
            >
                <BodyShort>
                    {t.rich("status", {
                        vedtak: (chunks) => <b>{chunks}</b>,
                        status: utfallVedtakStatus || "",
                        b: (chunks) => <b>{chunks}</b>,
                        norsk: (chunks) => <span lang="no">{chunks}</span>,
                    })}
                </BodyShort>
            </BoxNew>
            <div>{beskrivelse}</div>
            {vedtaksfilUrlList &&
                vedtaksfilUrlList.map((fil, index) => (
                    <StatusCard key={index} href={fil.url} icon={<FilePdfIcon />} description={fil.dato}>
                        Last ned vedtaksbrev
                    </StatusCard>
                ))}
            <StatusCard href="/utbetaling" icon={<BankNoteIcon />}>
                Se kommende utbetaling
            </StatusCard>
        </VStack>
    );
};
