import React, { PropsWithChildren } from "react";
import Head from "next/head";

import AppBanner from "./appBanner/AppBanner";

interface Props {
    title: string;
    bannerTitle?: string;
}

const MainLayout = ({ title, bannerTitle, children }: PropsWithChildren<Props>) => (
    <>
        <Head>
            <title>{title}</title>
        </Head>
        {bannerTitle && <AppBanner title={bannerTitle} />}
        <div className="blokk-center informasjon-side">{children}</div>
    </>
);

export default MainLayout;
