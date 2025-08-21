"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { BodyShort, Heading } from "@navikt/ds-react";

import { ForelopigSvarResponse } from "@generated/ssr/model";
import AlertWithCloseButton from "@components/alert/AlertWithCloseButton";

interface Props {
    forelopigSvarPromise: Promise<ForelopigSvarResponse>;
    navKontor: string;
}

const ForelopigSvarAlert = ({ forelopigSvarPromise, navKontor }: Props) => {
    const t = useTranslations("ForelopigSvarAlert");
    const forelopigSvar = use(forelopigSvarPromise);
    if (!forelopigSvar.harMottattForelopigSvar) {
        return null;
    }
    return (
        <AlertWithCloseButton variant="warning">
            <Heading level="2" size="small">
                {t("tittel")}
            </Heading>
            <BodyShort>
                {t.rich("beskrivelse", { norsk: (chunks) => <span lang="no">{chunks}</span>, navKontor })}
            </BodyShort>
        </AlertWithCloseButton>
    );
};

export default ForelopigSvarAlert;
