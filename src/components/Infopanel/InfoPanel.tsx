import React from "react";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import {Normaltekst, Element} from "nav-frontend-typografi";
import "./infoPanel.less";

const InfoPanelContainer: React.FC<{children: React.ReactNode, className?: string}> = ({children, className}) => {
    return (
        <div className={"infopanel_container " + className}>
            {children}
        </div>
    );
};

type Props = {
    children: React.ReactNode,
    tittel: React.ReactNode,
    href: string
};

const InfoPanel: React.FC<Props> = ({children, tittel, href}) => {
    return (
        <span className="infopanel_wrapper">
            <LenkepanelBase href={href} className="infopanel">
                <div>
                    <Element className="lenkepanel__heading">{tittel}</Element>
                    <Normaltekst>
                        {children}
                    </Normaltekst>
                </div>
            </LenkepanelBase>
        </span>
    );
};

export {InfoPanelContainer};
export default InfoPanel;
