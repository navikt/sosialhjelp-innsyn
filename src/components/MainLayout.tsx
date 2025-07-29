import React, { PropsWithChildren } from "react";
import Head from "next/head";
import { Page } from "@navikt/ds-react";

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
        <Page.Block width="md">{children}</Page.Block>
    </>
);

export default MainLayout;
