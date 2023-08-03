import React, {PropsWithChildren} from "react";
import AppBanner from "./appBanner/AppBanner";
import Head from "next/head";

interface Props {
    title: string;
    bannerTitle?: string;
}

const MainLayout = ({title, bannerTitle, children}: PropsWithChildren<Props>) => (
    <>
        <Head>
            <title>{title}</title>
        </Head>
        {bannerTitle && <AppBanner title={bannerTitle} />}
        <div className="blokk-center informasjon-side">{children}</div>
    </>
);

export default MainLayout;
