import React from "react";
import DocumentChecklist from "../ikoner/DocumentChecklist";
import DokumentBinder from "../ikoner/DocumentBinder";
import {Accordion, BodyShort, Label, Panel} from "@navikt/ds-react";
import styled from "styled-components";

const StyledAccordion = styled(Accordion)`
    .navds-accordion__header {
        border-bottom: none;
    }
`;

const StyledPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding: 2rem 80px 2rem 80px;
    }
`;

enum PanelIkon {
    BINDERS,
    CHECKLIST,
}

interface Props {
    tittel: string | React.ReactNode;
    underTittel: string | React.ReactNode;
    ikon: PanelIkon;
    children: React.ReactNode;
}

const EkspanderbartIkonPanel: React.FC<Props> = ({tittel, underTittel, ikon, children}) => {
    const heading = (
        <div className={"oppgaver_header"}>
            {ikon === PanelIkon.CHECKLIST && <DocumentChecklist />}
            {ikon === PanelIkon.BINDERS && <DokumentBinder />}
            <div>
                <Label>{tittel}</Label>
                <BodyShort>{underTittel}</BodyShort>
            </div>
        </div>
    );

    return (
        <StyledPanel className={"panel-glippe-over vilkar_panel"}>
            <StyledAccordion className={"react-collapse-animation"}>
                <Accordion.Item>
                    <Accordion.Header>{heading}</Accordion.Header>
                    <Accordion.Content>
                        <Panel className={"vilkar-ekspanderbart-panel-innhold-wrapper"}>{children}</Panel>
                    </Accordion.Content>
                </Accordion.Item>
            </StyledAccordion>
        </StyledPanel>
    );
};

export {PanelIkon};
export default EkspanderbartIkonPanel;
