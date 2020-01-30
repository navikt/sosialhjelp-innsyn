import * as React from "react";
import Lenke from "nav-frontend-lenker";
import UserIcon from "./UserIcon";
import "./saksoversiktBanner.less";
import {getDittNavUrl} from "../../utils/restUtils";

const SaksoversiktBanner: React.FC<{children: React.ReactNode } & {}> = ({children}) => {
    return (
        <div className="saksoversikt-banner">
            <div className="blokk-center">
                <p className="saksoversikt-banner__brodsmulesti">
                    <UserIcon />
                    <Lenke href={getDittNavUrl()}>Ditt NAV</Lenke>&nbsp;/ Økonomisk sosialhjelp
                </p>
                <h1 className="saksoversikt-banner__tittel">
                    {children}
                </h1>
            </div>
        </div>
    );
};

export default SaksoversiktBanner;
