import React from "react";
import "./infoPanel.less";
import {LinkPanel} from "@navikt/ds-react";

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
        <LinkPanel href={href} className="infopanel" border={false}>
            <div>
                <LinkPanel.Title>{tittel}</LinkPanel.Title>
                <LinkPanel.Description>{children}</LinkPanel.Description>
            </div>
        </LinkPanel>
    );
};

export {InfoPanelContainer};
export default InfoPanel;
