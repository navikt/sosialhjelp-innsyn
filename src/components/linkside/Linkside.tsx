import * as React from "react";
import {parse} from "query-string";
import {Navigate} from "react-router-dom";

const Linkside = () => {
    const redirectUrl = getRedirectUrl(window.location.search);
    return <Navigate to={redirectUrl} replace />;
};

export const getRedirectUrl = (searchParameters: string) => {
    const queryParameters = parse(searchParameters);

    let redirectURL: string = "/";
    if (queryParameters["goto"]) {
        redirectURL = queryParameters["goto"] as string;
        // last forward slash is optional, ensures that it is only one slash i the redirectURL
        redirectURL = redirectURL.replace(/\/sosialhjelp\/innsyn[/]?/i, "/");
    }
    return redirectURL;
};

export default Linkside;
