import { NextPageContext } from "next";
import NextErrorComponent from "next/error";

import ServerError from "./500";

const Error = ({ statusCode }: { statusCode: number }) => {
    if (statusCode === 500) return <ServerError />;
    return <NextErrorComponent statusCode={statusCode} />;
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
