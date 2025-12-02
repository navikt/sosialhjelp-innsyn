import React from "react";
import { BoxNew, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { KlageRef, SaksStatusResponse } from "@generated/model";

import Vedtak from "../vedtak/Vedtak";

import StatusTag from "./StatusTag";

interface Props {
    sak: SaksStatusResponse;
    innsendtKlage?: KlageRef;
}

const SingleSak = ({ sak, innsendtKlage }: Props): React.JSX.Element | null => {
    const t = useTranslations("SingleSak");
    const vedtakUtfall = sak.utfallVedtak;
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
                        <Heading size="medium" level="2">
                            {t("vedtak")}
                        </Heading>
                        <StatusTag vedtakUtfall={vedtakUtfall} className="self-start" />
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
