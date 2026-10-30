import { Box, Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { randomUUID } from "node:crypto";
import { EttersendelseDto, VedleggResponse } from "@generated/model";

import KlageEttersendelse from "./KlageEttersendelse";
import Dokumenter from "./Dokumenter";

interface Props {
    fiksDigisosId: string;
    klageId: string;
    klagePdf: VedleggResponse;
    opplastedeVedlegg: VedleggResponse[];
    ettersendelser: EttersendelseDto[];
}

const KlageDokumentasjon = async ({ fiksDigisosId, klageId, klagePdf, opplastedeVedlegg, ettersendelser }: Props) => {
    const t = await getTranslations("KlageDokumentasjon");

    return (
        <VStack gap="space-16">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <Box
                borderColor="info-subtle"
                background="info-soft"
                borderRadius="12"
                borderWidth="1"
                paddingBlock="space-8"
                paddingInline="space-16"
            >
                <VStack gap="space-40">
                    <KlageEttersendelse fiksDigisosId={fiksDigisosId} klageId={klageId} contextId={randomUUID()} />
                    <Dokumenter
                        klagePdf={klagePdf}
                        opplastedeVedlegg={opplastedeVedlegg}
                        ettersendelser={ettersendelser}
                    />
                </VStack>
            </Box>
        </VStack>
    );
};

export default KlageDokumentasjon;
