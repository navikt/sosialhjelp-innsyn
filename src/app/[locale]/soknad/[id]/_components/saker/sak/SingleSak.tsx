import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { SaksStatusResponse } from "@generated/model";

import SakPanel from "./sakpanel/SakPanel";

interface Props {
    sak: SaksStatusResponse;
}

const SingleSak = ({ sak }: Props): React.JSX.Element | null => {
    const t = useTranslations("SingleSak");
    if (sak.vedtak.length === 0) {
        return null;
    }
    return (
        <>
            <VStack gap="4">
                <Heading size="medium" level="2">
                    {t("vedtak")}
                </Heading>
                <SakPanel sak={sak} />
            </VStack>
        </>
    );
};

export default SingleSak;
