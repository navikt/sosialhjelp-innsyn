import * as React from "react";
import Banner from "../banner/Banner";
import {useSelector} from "react-redux";

const AppBanner: React.FC<{}> = () => {
    const tittel = useSelector((state: any) => state.navigasjon.bannerTittel);

    return <Banner>{tittel ? tittel : "Økonomisk sosialhjelp"}</Banner>;
};

export default AppBanner;
