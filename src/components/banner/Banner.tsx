import {Heading} from "@navikt/ds-react";
import * as React from "react";
import "./banner.less";

const Banner: React.FC<{children: React.ReactNode} & {}> = ({children}) => {
    return (
        <div className="banner">
            <div className="blokk-center">
                <Heading level="1" size="medium">
                    {children}
                </Heading>
            </div>
        </div>
    );
};

export default Banner;
