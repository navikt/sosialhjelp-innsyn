import React, {Component} from "react";
import {node, string} from "prop-types";
import {isLocalhost, isUsingMockAlt} from "../../utils/restUtils";

class HotjarTrigger extends Component {
    componentDidMount() {
        const {hotjarTrigger} = this.props;
        if (
            typeof window.hj === "function" &&
            !isUsingMockAlt(window.location.origin) &&
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
