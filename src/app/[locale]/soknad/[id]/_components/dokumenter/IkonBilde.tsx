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

// Copy-paste fra aksel sin ItemIcon komponent
// fordi det er ikke en direkte måte å bruke det komponentet på
const IkonBilde = (fil: VedleggResponse) => {
    const extension = fil.filnavn.substring(fil.filnavn.lastIndexOf(".") + 1);
    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "webp":
            return <FileImageIcon />;
        case "pdf":
            return <FilePdfIcon />;
        case "txt":
            return <FileTextIcon />;
        case "csv":
            return <FileCsvIcon />;
        case "xls":
        case "xlsx":
            return <FileExcelIcon />;
        case "doc":
        case "docx":
            return <FileWordIcon />;
        default:
            return <FileIcon />;
    }
};

export default IkonBilde;
