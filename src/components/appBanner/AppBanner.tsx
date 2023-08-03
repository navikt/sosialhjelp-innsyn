import * as React from "react";
import Banner from "../banner/Banner";
import {useTranslation} from "next-i18next";

interface Props {
    title: string;
}

const AppBanner = ({title}: Props): React.JSX.Element => {
    const {t} = useTranslation();
    return <Banner>{title}</Banner>;
};

export default AppBanner;
