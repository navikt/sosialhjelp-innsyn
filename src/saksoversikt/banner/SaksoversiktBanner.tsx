import * as React from "react";
import "./saksoversiktBanner.css";
import {Heading} from "@navikt/ds-react";

const SaksoversiktBanner: React.FC<{children: React.ReactNode} & {}> = ({children}) => {
    return (
        <div className="saksoversikt-banner">
            <div className="blokk-center">
                <Heading level="1" size="xlarge" className="saksoversikt-banner__tittel">
                    {children}
                </Heading>
            </div>
        </div>
    );
};

export default SaksoversiktBanner;
