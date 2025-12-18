import React, { PropsWithChildren } from "react";
import Head from "next/head";
import { Page } from "@navikt/ds-react";

import DriftsmeldingerPages from "@components/driftsmelding/DriftsmeldingerPages";
import { Driftsmelding } from "@components/driftsmelding/getDriftsmeldinger";

import AppBanner from "./appBanner/AppBanner";

interface Props {
    title: string;
    bannerTitle?: string;
    driftsmeldinger: Driftsmelding[];
}

const MainLayout = ({ title, bannerTitle, children, driftsmeldinger }: PropsWithChildren<Props>) => (
    <>
        <Head>
            <title>{title}</title>
        </Head>
        {bannerTitle && <AppBanner title={bannerTitle} />}
        <Page.Block width="md">
            <DriftsmeldingerPages driftsmeldinger={driftsmeldinger} />
            {children}
        </Page.Block>
    </>
);

export default MainLayout;
