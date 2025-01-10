import * as React from "react";

import Banner from "../banner/Banner";

interface Props {
    title: string;
}

const AppBanner = ({ title }: Props): React.JSX.Element => {
    return <Banner>{title}</Banner>;
};

export default AppBanner;
