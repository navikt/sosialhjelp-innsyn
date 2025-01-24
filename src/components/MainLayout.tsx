import React, { PropsWithChildren } from "react";
import Head from "next/head";

import AppBanner from "./appBanner/AppBanner";
import { DriftsmeldingAalesund } from "./driftsmelding/DriftsmeldingAalesund";

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
        <div className="blokk-center informasjon-side">
            <DriftsmeldingAalesund />
            {children}
        </div>
    </>
);

export default MainLayout;
