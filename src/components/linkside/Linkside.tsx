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
        redirectURL = redirectURL.replace("/sosialhjelp/innsyn", "/");
    }
    return redirectURL;
};

export default Linkside;
