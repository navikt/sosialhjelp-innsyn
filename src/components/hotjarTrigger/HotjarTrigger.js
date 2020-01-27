import React, {Component} from 'react';
import {node, string} from 'prop-types';

export default class HotjarTrigger extends Component {
    componentDidMount() {
        const {hotjarTrigger} = this.props;
        if (typeof window.hj === 'function' && windows.location.href.indexOf('.labs.nais.io') === -1
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

export const HarSakerFraInnsynHotjarTrigger = ({children}) => (
    <HotjarTrigger hotjarTrigger="har_saker_fra_innsyn">
        {children}
    </HotjarTrigger>
);

HarSakerFraInnsynHotjarTrigger.propTypes = {
    children: node
};