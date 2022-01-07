import React, {Component} from "react";
import {node, string} from "prop-types";
import {isLocalhost, isMockServer} from "../../utils/restUtils";

class HotjarTrigger extends Component {
    componentDidMount() {
        const {hotjarTrigger} = this.props;
        console.log(hotjarTrigger, window.hj);
        if (
            typeof window.hj === "function" &&
            !isMockServer(window.location.origin) &&
            !isLocalhost(window.location.origin)
        ) {
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

export const SoknadHotjarTrigger = ({children, trigger}) =>
    trigger ? <HotjarTrigger hotjarTrigger={trigger}>{children}</HotjarTrigger> : null;

SoknadHotjarTrigger.propTypes = {
    children: node,
    trigger: string,
};
