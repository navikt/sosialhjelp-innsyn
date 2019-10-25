import * as React from "react";
import { parse } from "query-string";
import {Redirect} from "react-router";

const Linkside: React.FC<{}> = () => {
    const queryParameters = parse(window.location.search);
    let redirectURL: string = "status";
    if (queryParameters["goto"]) {
        redirectURL = queryParameters["goto"] as string;
        redirectURL = redirectURL.replace("/sosialhjelp/innsyn/", "");
    }

    return (
        <Redirect to={redirectURL} />
    )
};

export default Linkside;
