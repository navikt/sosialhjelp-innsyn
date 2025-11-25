import { Heading, HStack } from "@navikt/ds-react";

import { SaksStatusResponseUtfallVedtak } from "@generated/model";

import StatusTag from "./StatusTag";

interface Props {
    tittel: string;
    vedtakUtfall?: SaksStatusResponseUtfallVedtak;
    fontSize?: "large" | "small" | "xlarge" | "medium" | "xsmall";
}

const Sakstittel = ({ tittel, vedtakUtfall, fontSize = "large" }: Props) => {
    return (
        <HStack gap="2">
            <Heading size={fontSize} level="3">
                {tittel}
            </Heading>
            <StatusTag vedtakUtfall={vedtakUtfall} className="self-start" />
        </HStack>
    );
};

export default Sakstittel;
