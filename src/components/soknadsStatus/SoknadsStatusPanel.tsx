import React from "react";

import Panel from "../panel/Panel";
import {SoknadsStatusResponseStatus} from "../../generated/model";

import SoknadsStatusDecoration from "./SoknadsStatusDecoration";
import SoknadsStatusHeading from "./SoknadsStatusHeading";

interface Props {
    hasError: boolean;
    children: React.ReactNode;
    soknadsStatus?: SoknadsStatusResponseStatus;
}

const SoknadsStatusPanel = ({hasError, children, soknadsStatus}: Props) => {
    return (
        <Panel header={<SoknadsStatusHeading soknadsStatus={soknadsStatus} />} hasError={hasError}>
            <SoknadsStatusDecoration soknadsStatus={soknadsStatus} />
            {children}
        </Panel>
    );
};
export default SoknadsStatusPanel;
