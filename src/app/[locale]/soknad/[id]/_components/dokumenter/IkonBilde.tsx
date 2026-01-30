"use client";

import {
    FileCsvIcon,
    FileExcelIcon,
    FileIcon,
    FileImageIcon,
    FilePdfIcon,
    FileTextIcon,
    FileWordIcon,
} from "@navikt/aksel-icons";
import { VedleggResponse } from "@generated/model";
import { useTranslations } from "next-intl";

// Copy-paste fra aksel sin ItemIcon komponent
// fordi det er ikke en direkte måte å bruke det komponentet på
const IkonBilde = (fil: VedleggResponse) => {
    const extension = fil.filnavn.substring(fil.filnavn.lastIndexOf(".") + 1);
    const t = useTranslations("IkonBilde");
    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "webp":
            return <FileImageIcon title={t("image")} />;
        case "pdf":
            return <FilePdfIcon title={t("pdf")} />;
        case "txt":
            return <FileTextIcon title={t("txt")} />;
        case "csv":
            return <FileCsvIcon title={t("csv")} />;
        case "xls":
        case "xlsx":
            return <FileExcelIcon title={t("excel")} />;
        case "doc":
        case "docx":
            return <FileWordIcon title={t("word")} />;
        default:
            return <FileIcon title={t("fil")} />;
    }
};

export default IkonBilde;
