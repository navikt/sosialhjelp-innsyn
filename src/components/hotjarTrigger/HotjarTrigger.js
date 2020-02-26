import React, {Component} from 'react';
import {node, string} from 'prop-types';
import {erDev, erMockServer} from "../../utils/restUtils";

export default class HotjarTrigger extends Component {
    componentDidMount() {
        const {hotjarTrigger} = this.props;
        if (typeof window.hj === 'function'
            && !erMockServer()
            && !erDev()
        ) {
            window.hj('trigger', hotjarTrigger);
        }
    }

    render() {
        const {children} = this.props;
        return children;
    }
}

HotjarTrigger.propTypes = {
    hotjarTrigger: string.isRequired,
    children: node.isRequired
};

export const LandingssideMedSakerFraInnsynHotjarTrigger = ({children}) => (
    <HotjarTrigger hotjarTrigger="landingsside_med_saker_fra_innsyn">
        {children}
    </HotjarTrigger>
);

LandingssideMedSakerFraInnsynHotjarTrigger.propTypes = {
    children: node
};

export const LandingssideUtenSakerFraInnsynHotjarTrigger = ({children}) => (
    <HotjarTrigger hotjarTrigger="landingsside_uten_saker_fra_innsyn">
        {children}
    </HotjarTrigger>
);

LandingssideUtenSakerFraInnsynHotjarTrigger.propTypes = {
    children: node
};