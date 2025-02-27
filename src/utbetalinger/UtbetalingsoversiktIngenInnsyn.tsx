import React from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { StyledGuidePanel } from "../styles/styledGuidePanel";
import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";

const UtbetalingsoversiktIngenInnsyn = () => {
    const { t } = useTranslation();

    return (
        <div className="pt-4 pb-12">
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <div className="flex flex-col items-center mx-12 max-w-[45rem]">
                    <Heading level="2" size="medium" spacing>
                        {t("ingen_soknad.tittel")}
                    </Heading>
                    <BodyLong>{t("ingen_soknad.info")}</BodyLong>
                </div>
            </StyledGuidePanel>
        </div>
    );
};

export default UtbetalingsoversiktIngenInnsyn;
