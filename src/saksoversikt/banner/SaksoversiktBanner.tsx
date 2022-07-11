import * as React from "react";
import UserIcon from "./UserIcon";
import "./saksoversiktBanner.css";
import {getDittNavUrl} from "../../utils/restUtils";
import {BodyShort, Heading, Link} from "@navikt/ds-react";

const SaksoversiktBanner: React.FC<{children: React.ReactNode} & {}> = ({children}) => {
    return (
        <div className="saksoversikt-banner">
            <div className="blokk-center">
                <div className="saksoversikt-banner__brodsmulesti">
                    <UserIcon />
                    <BodyShort>
                        <Link href={getDittNavUrl()}>Ditt NAV</Link> / Økonomisk sosialhjelp
                    </BodyShort>
                </div>
                <Heading level="1" size="xlarge" className="saksoversikt-banner__tittel">
                    {children}
                </Heading>
            </div>
        </div>
    );
};

export default SaksoversiktBanner;
