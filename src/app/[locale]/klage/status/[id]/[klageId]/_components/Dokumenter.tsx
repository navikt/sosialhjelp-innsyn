import { Heading, VStack } from "@navikt/ds-react";
import { FileUploadItem } from "@navikt/ds-react/FileUpload";
import { getTranslations } from "next-intl/server";
import { VedleggResponse } from "@generated/model";

type Props = {
    klagePdf: VedleggResponse;
};

const Dokumenter = async ({ klagePdf }: Props) => {
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
            </VStack>
        </div>
    );
};

export default Dokumenter;
