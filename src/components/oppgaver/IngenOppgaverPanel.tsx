import * as React from "react";
import { useTranslations } from "next-intl";
import { BodyShort, Label, Panel } from "@navikt/ds-react";
import styled from "styled-components";
import { PaperclipIcon, TasklistIcon } from "@navikt/aksel-icons";

const StyledPanel = styled(Panel)`
    margin-top: 0.5rem;
    margin-bottom: 0 !important;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 20px 12px;
`;

interface Props {
    leserData: boolean;
}

const IngenOppgaverPanel = ({ leserData }: Props) => {
    const t = useTranslations("common");
    if (leserData) {
        return null;
    }
    return (
        <StyledPanel>
            <>
                <TasklistIcon width="1.5rem" height="1.5rem" style={{ marginTop: "6px" }} aria-hidden title="oppgave" />
                <div>
                    <Label as="p">{t("oppgaver.ingen_oppgaver")}</Label>
                    <BodyShort>{t("oppgaver.beskjed")}</BodyShort>
                </div>
            </>
            <>
                <PaperclipIcon
                    width="1.5rem"
                    height="1.5rem"
                    style={{ marginTop: "6px" }}
                    aria-hidden
                    title="vedlegg"
                />
                <div>
                    <Label as="p">{t("oppgaver.andre_dokumenter")}</Label>
                    <BodyShort>{t("oppgaver.andre_dokumenter_beskjed")}</BodyShort>
                </div>
            </>
        </StyledPanel>
    );
};

export default IngenOppgaverPanel;
