import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { KlageRef, SaksStatusResponse } from "@generated/model";

import SakPanel from "./sakpanel/SakPanel";

interface Props {
    sak: SaksStatusResponse;
    innsendtKlage?: KlageRef;
}

const SingleSak = ({ sak, innsendtKlage }: Props): React.JSX.Element | null => {
    const t = useTranslations("SingleSak");
    if (!sak.utfallVedtak) {
        return null;
    }
    return (
        <>
            {sak.utfallVedtak && (
                <VStack gap="4">
                    <Heading size="medium" level="2">
                        {t("vedtak")}
                    </Heading>
                    <SakPanel sak={sak} innsendtKlage={innsendtKlage} />
                </VStack>
            )}
        </>
    );
};

export default SingleSak;
