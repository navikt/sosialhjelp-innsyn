import * as React from "react";
import {parse} from "query-string";
import {Navigate} from "react-router-dom";

const Linkside = () => {
    const redirectUrl = getRedirectUrl(window.location.search);
    return <Navigate to={redirectUrl} replace={true} />;
};

export const getRedirectUrl = (searchParameters: string) => {
    const queryParameters = parse(searchParameters);
    console.log("getRedirectUrl " + queryParameters);
    let redirectURL: string = "/";
    if (queryParameters["goto"]) {
        redirectURL = queryParameters["goto"] as string;
        redirectURL = redirectURL.replace("/sosialhjelp/innsyn", "/");
        // goto path contains /link when using loginservice and sosialhjelp/login-api. Remove this to avoid
        // loop calling the <Linkside> component
        redirectURL = redirectURL.replace("/link", "");
    }
    console.log("redirectUrl: " + redirectURL);
    return redirectURL;
};

export default Linkside;
