import React from "react";
import {connect} from "react-redux";
import {DispatchProps, InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {
    initialInnsynsdataRestStatus,
    InnsynsdataSti,
    InnsynsdataType,
    Vedlegg
} from "../redux/innsynsdata/innsynsdataReducer";

import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import {AvsnittBoks} from "../components/paneler/layoutKomponenter";
import {Hovedknapp} from "nav-frontend-knapper";
import VedleggView from "../components/vedlegg/VedleggView";
import {Panel} from "nav-frontend-paneler";
import {FormattedMessage} from "react-intl";

export interface InnsynsdataContainerProps {
    innsynsdata?: InnsynsdataType;
    restStatus?: REST_STATUS;
    match: {
        params: {
            soknadId: any;
        }
    };
}

type Props = InnsynsdataContainerProps & DispatchProps;

class VedleggsSide extends React.Component<Props, {}> {

    componentDidMount() {
        const soknadId = this.props.match.params.soknadId;
        const fiksDigisosId: string = soknadId === undefined ? "1234" : soknadId;
        this.props.dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG))
    }

    leserData(restStatus: string): boolean {
        return restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    }

    render() {
        const {innsynsdata} = this.props;
        let vedlegg: Vedlegg[] = [];
        let restStatus = initialInnsynsdataRestStatus;
        if (innsynsdata && innsynsdata.soknadsStatus) {
            vedlegg = innsynsdata.vedlegg;
        }
        const leserData: boolean = this.leserData(restStatus.vedlegg);

        return (
            <Panel className="vedlegg_liste_panel">
                <Innholdstittel className="layout_overskriftboks">
                    <FormattedMessage id="vedlegg.tittel" />
                </Innholdstittel>
                <Normaltekst>
                    <FormattedMessage id="vedlegg.ingress" />
                </Normaltekst>
                <AvsnittBoks>
                    <Hovedknapp type="hoved"><FormattedMessage id="vedlegg.ettersend_knapptekst" /></Hovedknapp>
                </AvsnittBoks>
                <VedleggView vedlegg={ vedlegg } leserData={leserData}/>
            </Panel>
        )
    }

}

const mapStateToProps = (state: InnsynAppState) => ({
    innsynsdata: state.innsynsdata
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VedleggsSide);
