import React from "react";
import { useTranslations } from "next-intl";

import Panel from "../panel/Panel";

const OppgaverPanel = ({ hasError, children }: { hasError: boolean; children: React.ReactNode }) => {
    const t = useTranslations("common");

    return (
        <Panel hasError={hasError} header={t("oppgaver.dine_oppgaver")}>
            {children}
        </Panel>
    );
};

export default OppgaverPanel;
