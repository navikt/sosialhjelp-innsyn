import { Heading } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { SaksStatusResponseUtfallVedtak } from "@generated/model";

import StatusTag from "./StatusTag";
interface Props {
    tittel: string;
    vedtakUtfall?: SaksStatusResponseUtfallVedtak;
    fontSize?: "large" | "small" | "xlarge" | "medium" | "xsmall";
}

const Sakstittel = ({ tittel, vedtakUtfall, fontSize = "large" }: Props) => {
    const t = useTranslations("Sakstittel");
    return (
        <>
            <Heading size={fontSize} level="2">
                {t.rich("tittel", {
                    sakstittel: tittel,
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                })}
            </Heading>
            <StatusTag vedtakUtfall={vedtakUtfall} className="self-start" />
        </>
    );
};

export default Sakstittel;
