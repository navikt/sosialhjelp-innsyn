import * as React from "react";
import Banner from "../banner/Banner";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const AppBanner: React.FC<{}> = () => {
    const tittel = useSelector((state: any) => state.navigasjon.bannerTittel);
    const {t} = useTranslation();
    return <Banner>{tittel ? tittel : t("app.tittel")}</Banner>;
};

export default AppBanner;
