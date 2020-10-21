import * as React from "react";
import {parse} from "query-string";
import {Redirect} from "react-router";

const Linkside: React.FC<{}> = () => {
    const redirectUrl = getRedirectUrl(window.location.search);
    return <Redirect to={redirectUrl} />;
};

export const getRedirectUrl = (searchParameters: string) => {
    const queryParameters = parse(searchParameters);
    let redirectURL: string = "";
    if (queryParameters["goto"]) {
        redirectURL = queryParameters["goto"] as string;
        redirectURL = redirectURL.replace("/sosialhjelp/innsyn", "/innsyn");
    }
    return redirectURL;
};

export default Linkside;
