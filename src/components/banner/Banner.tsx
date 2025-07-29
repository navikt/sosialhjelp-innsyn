import { Heading } from "@navikt/ds-react";
import * as React from "react";
import { PropsWithChildren } from "react";

const Banner = (props: PropsWithChildren) => {
    return (
        <div className="banner">
            <div>
                <Heading level="1" size="medium">
                    {props.children}
                </Heading>
            </div>
        </div>
    );
};

export default Banner;
