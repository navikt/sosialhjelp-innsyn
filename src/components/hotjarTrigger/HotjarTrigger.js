import React, {Component} from "react";
import {node, string} from "prop-types";
import {erDev, erMockServer} from "../../utils/restUtils";

export default class HotjarTrigger extends Component {
    componentDidMount() {
        const {hotjarTrigger} = this.props;
        if (typeof window.hj === "function" && !erMockServer() && !erDev()) {
            window.hj("trigger", hotjarTrigger);
        }
    }

    render() {
        const {children} = this.props;
        return children;
    }
}

HotjarTrigger.propTypes = {
    hotjarTrigger: string.isRequired,
    children: node.isRequired,
};

export const SoknadMedInnsynHotjarTrigger = ({children}) => (
    <HotjarTrigger hotjarTrigger="soknad_med_innsyn">{children}</HotjarTrigger>
);

SoknadMedInnsynHotjarTrigger.propTypes = {
    children: node,
};

export const SoknadMedInnsynFraBergenHotjarTrigger = ({children}) => (
    <HotjarTrigger hotjarTrigger="soknad_med_innsyn_fra_bergen">{children}</HotjarTrigger>
);

SoknadMedInnsynFraBergenHotjarTrigger.propTypes = {
    children: node,
};

export const SoknadUtenInnsynHotjarTrigger = ({children}) => (
    <HotjarTrigger hotjarTrigger="soknad_uten_innsyn">{children}</HotjarTrigger>
);

SoknadUtenInnsynHotjarTrigger.propTypes = {
    children: node,
};
