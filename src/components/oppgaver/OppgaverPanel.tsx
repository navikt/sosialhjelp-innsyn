import React from "react";
import {useTranslation} from "next-i18next";
import Panel from "../panel/Panel";

const OppgaverPanel = ({
    hasError,
    harOppgaver,
    children,
}: {
    hasError: boolean;
    harOppgaver: boolean;
    children: React.ReactNode;
}) => {
    const {t} = useTranslation();

    return (
        <>
            <Panel hasError={hasError} harOppgaver={harOppgaver} header={t("oppgaver.dine_oppgaver")}>
                {children}
            </Panel>
        </>
    );
};

export default OppgaverPanel;
