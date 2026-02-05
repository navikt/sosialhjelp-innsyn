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
import { useTranslations } from "next-intl";

const IkonBilde = ({ filename }: { filename: string }) => {
    const t = useTranslations("IkonBilde");
    const extension = filename.substring(filename.lastIndexOf(".") + 1);
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
