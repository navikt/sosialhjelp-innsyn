"use client";

import { use } from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { FilePdfIcon } from "@navikt/aksel-icons";

import { ForelopigSvarResponse } from "@generated/ssr/model";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

interface Props {
    forelopigSvarPromise: Promise<ForelopigSvarResponse>;
}

const ForelopigSvar = ({ forelopigSvarPromise }: Props) => {
    const t = useTranslations("ForelopigSvar");
    const forelopigSvar = use(forelopigSvarPromise);
    if (!forelopigSvar.harMottattForelopigSvar || !forelopigSvar.link) {
        return null;
    }
    return (
        <VStack gap="4">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <DigisosLinkCard href={forelopigSvar.link} downloadIcon icon={<FilePdfIcon />}>
                {t("lastNed")}
            </DigisosLinkCard>
        </VStack>
    );
};

export default ForelopigSvar;
