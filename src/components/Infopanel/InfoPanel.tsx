import React from "react";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import {Normaltekst, Element} from "nav-frontend-typografi";
import "./infoPanel.less";

const InfoPanelContainer: React.FC<{children: React.ReactNode; className?: string}> = ({children, className}) => {
    return <nav className={"infopanel_container " + className}>{children}</nav>;
};

type Props = {
    children: React.ReactNode;
    tittel: React.ReactNode;
    href: string;
};

const InfoPanel: React.FC<Props> = ({children, tittel, href}) => {
    return (
        <LenkepanelBase href={href} className="infopanel">
            <div>
                <Element className="lenkepanel__heading">{tittel}</Element>
                <Normaltekst>{children}</Normaltekst>
            </div>
        </LenkepanelBase>
    );
};

export {InfoPanelContainer};
export default InfoPanel;
