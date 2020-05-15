import React from "react";
import {EkspanderbartpanelBase} from "nav-frontend-ekspanderbartpanel";
import {Panel} from "nav-frontend-paneler";
import DocumentChecklist from "../ikoner/DocumentChecklist";
import {Element, Normaltekst} from "nav-frontend-typografi";
import DokumentBinder from "../ikoner/DocumentBinder";

enum PanelIkon {
    BINDERS,
    CHECKLIST,
}

interface Props {
    tittel: string | React.ReactNode;
    underTittel: string | React.ReactNode;
    ikon: PanelIkon;
    children: React.ReactNode;
    defaultAapen?: boolean;
}

const EkspanderbartIkonPanel: React.FC<Props> = ({tittel, underTittel, ikon, children, defaultAapen}) => {
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
            <EkspanderbartpanelBase heading={heading} className={"react-collapse-animation"} apen={defaultAapen}>
                <Panel className={"vilkar-ekspanderbart-panel-innhold-wrapper"}>{children}</Panel>
            </EkspanderbartpanelBase>
        </Panel>
    );
};

export {PanelIkon};
export default EkspanderbartIkonPanel;
