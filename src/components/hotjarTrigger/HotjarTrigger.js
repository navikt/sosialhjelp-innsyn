import React, {Component} from "react";
import {node, string} from "prop-types";
import {isDev, isMockServer} from "../../utils/restUtils";

export default class HotjarTrigger extends Component {
    componentDidMount() {
        const {hotjarTrigger} = this.props;
        if (typeof window.hj === "function" && !isMockServer(window.location.origin) && !isDev(window.location.origin)) {
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
    <HotjarTrigger hotjarTrigger="digisos_soknad_med_innsyn">{children}</HotjarTrigger>
);

SoknadMedInnsynHotjarTrigger.propTypes = {
    children: node,
};

export const SoknadFraBergenHotjarTrigger = ({children}) => (
    <HotjarTrigger hotjarTrigger="digisos_soknad_fra_bergen">{children}</HotjarTrigger>
);

SoknadFraBergenHotjarTrigger.propTypes = {
    children: node,
};

export const SoknadUtenInnsynHotjarTrigger = ({children}) => (
    <HotjarTrigger hotjarTrigger="digisos_soknad_uten_innsyn">{children}</HotjarTrigger>
);

SoknadUtenInnsynHotjarTrigger.propTypes = {
    children: node,
};
