import { Heading, HStack } from "@navikt/ds-react";
import { VedtakDtoUtfall } from "@generated/model";

import StatusTag from "./StatusTag";
import { useTranslations } from "next-intl";

interface Props {
    utfall?: VedtakDtoUtfall;
    dato: string;
}

const VedtakTittel = ({ utfall, dato }: Props) => {
    const t = useTranslations("VedtakTittel");
    return (
        <HStack gap="space-8" align="center">
            <Heading size="small" level="3" lang="no">
                {t("tittel", { dato: new Date(dato) })}
            </Heading>
            <StatusTag vedtakUtfall={utfall} className="self-start" />
        </HStack>
    );
};

export default VedtakTittel;
