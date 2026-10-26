import { Heading, VStack } from "@navikt/ds-react";
import { FileUploadItem } from "@navikt/ds-react/FileUpload";
import { getTranslations } from "next-intl/server";
import { EttersendelseDto, VedleggResponse } from "@generated/model";

type Props = {
    klagePdf: VedleggResponse;
    ettersendelser: EttersendelseDto[];
};

const Dokumenter = async ({ klagePdf, ettersendelser }: Props) => {
    const t = await getTranslations("KlageDokumenter");

    return (
        <div>
            <Heading size="medium" level="2" className="mb-4">
                {t("tittel")}
            </Heading>
            <VStack gap="space-8">
                {klagePdf && (
                    <FileUploadItem
                        href={klagePdf.url}
                        file={{
                            name: klagePdf.filnavn?.length ? klagePdf.filnavn : t("klagePdfDefaultTittel"),
                            size: klagePdf.storrelse,
                        }}
                        className="w-full"
                    />
                )}
                {ettersendelser
                    .flatMap((ettersendelse) => ettersendelse.vedlegg)
                    .map((vedlegg) => (
                        <FileUploadItem
                            key={vedlegg.filnavn}
                            href={vedlegg.url}
                            file={{
                                name: vedlegg.filnavn?.length ? vedlegg.filnavn : t("ettersendelseDefaultTittel"),
                                size: vedlegg.storrelse,
                            }}
                            className="w-full"
                        />
                    ))}
            </VStack>
        </div>
    );
};

export default Dokumenter;
