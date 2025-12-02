import React from "react";
import { BoxNew, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { KlageRef, SaksStatusResponse } from "@generated/model";

import Vedtak from "../vedtak/Vedtak";

import Sakstittel from "./Sakstittel";

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
        <VStack gap="16">
            {sak.utfallVedtak && (
                <VStack gap="4">
                    <Heading size="large" level="2">
                        {t("vedtak")}
                    </Heading>
                    <BoxNew borderWidth="1" borderRadius="xlarge" borderColor="neutral-subtle" padding="8">
                        <Sakstittel fontSize="small" tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
                        <Vedtak
                            vedtakUtfall={sak.utfallVedtak}
                            vedtaksliste={sak.vedtaksfilUrlList}
                            innsendtKlage={innsendtKlage}
                        />
                    </BoxNew>
                </VStack>
            )}
        </VStack>
    );
};

export default SingleSak;
