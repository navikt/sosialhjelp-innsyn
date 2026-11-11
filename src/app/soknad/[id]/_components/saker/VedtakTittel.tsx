import { BodyLong, HStack } from "@navikt/ds-react";
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
        <HStack align="center" justify="space-between">
            <StatusTag vedtakUtfall={utfall} className="self-start" />
            <BodyLong>{t("mottatt", { dato: new Date(dato) })}</BodyLong>
        </HStack>
    );
};

export default VedtakTittel;
