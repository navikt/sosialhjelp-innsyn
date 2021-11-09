import React from "react";
import Panel from "nav-frontend-paneler";
import DocumentChecklist from "../ikoner/DocumentChecklist";
import {Element, Normaltekst} from "nav-frontend-typografi";
import DokumentBinder from "../ikoner/DocumentBinder";
import {Accordion} from "@navikt/ds-react";
import styled from "styled-components";

const StyledAccordion = styled(Accordion)`
    .navds-accordion__header {
        border-bottom: none;
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
                <Element>{tittel}</Element>
                <Normaltekst>{underTittel}</Normaltekst>
            </div>
        </div>
    );

    return (
        <Panel className={"panel-glippe-over vilkar_panel"}>
            <StyledAccordion className={"react-collapse-animation"}>
                <Accordion.Item>
                    <Accordion.Header>{heading}</Accordion.Header>
                    <Accordion.Content>
                        <Panel className={"vilkar-ekspanderbart-panel-innhold-wrapper"}>{children}</Panel>
                    </Accordion.Content>
                </Accordion.Item>
            </StyledAccordion>
        </Panel>
    );
};

export {PanelIkon};
export default EkspanderbartIkonPanel;
