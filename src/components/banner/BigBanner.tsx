import * as React from "react";
import "./bigbanner.css";
import {Heading} from "@navikt/ds-react";

const BigBanner: React.FC<{tittel: string} & {}> = ({tittel}) => {
    return (
        <div className="big_banner">
            <div className="big_banner__blokk-center">
                <Heading level="1" size="large">
                    {tittel}
                </Heading>
            </div>
        </div>
    );
};

export default BigBanner;
