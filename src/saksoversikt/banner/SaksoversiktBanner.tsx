import * as React from "react";
import UserIcon from "./UserIcon";
import "./saksoversiktBanner.less";
import {getDittNavUrl} from "../../utils/restUtils";
import {Link} from "@navikt/ds-react";

const SaksoversiktBanner: React.FC<{children: React.ReactNode} & {}> = ({children}) => {
    return (
        <div className="saksoversikt-banner">
            <div className="blokk-center">
                <p className="saksoversikt-banner__brodsmulesti">
                    <UserIcon />
                    <Link href={getDittNavUrl()}>Ditt NAV</Link>&nbsp;/ Økonomisk sosialhjelp
                </p>
                <h1 className="saksoversikt-banner__tittel">{children}</h1>
            </div>
        </div>
    );
};

export default SaksoversiktBanner;
