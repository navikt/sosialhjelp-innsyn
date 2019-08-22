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
import SoknadsStatus from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import Historikk from "../components/historikk/Historikk";
import VedleggUtbetalingerLenker from "../components/vedleggUtbetalingerLenker/VedleggUtbetalingerLenker";

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

class SaksStatusView extends React.Component<Props, {}> {

    componentDidMount() {
        const fiksDigisosId : string = this.props.match.params.soknadId === undefined ? "1234" : this.props.match.params.soknadId;
        const restDataStier: InnsynsdataSti[] = [
            InnsynsdataSti.SAKSSTATUS,
            InnsynsdataSti.OPPGAVER,
            InnsynsdataSti.SOKNADS_STATUS,
            InnsynsdataSti.HENDELSER,
            InnsynsdataSti.VEDLEGG
        ];
        restDataStier.map((restDataSti: InnsynsdataSti) =>
            this.props.dispatch(hentInnsynsdata(fiksDigisosId, restDataSti))
        );
    }

    leserData(restStatus: string): boolean {
        return restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    }

    render() {
        const {innsynsdata} = this.props;
        let status = null;
        let saksStatus = null;
        let oppgaver = null;
        let hendelser = null;
        let vedlegg: Vedlegg[] = [];
        let restStatus = initialInnsynsdataRestStatus;
        if (innsynsdata && innsynsdata.soknadsStatus) {
            saksStatus = innsynsdata.saksStatus;
            status = innsynsdata.soknadsStatus.status;
            oppgaver = innsynsdata.oppgaver;
            hendelser = innsynsdata.hendelser;
            vedlegg = innsynsdata.vedlegg;
            restStatus = innsynsdata.restStatus;
        }

        return (
            <>
                <SoknadsStatus
                    status={status}
                    saksStatus={saksStatus}
                    leserData={this.leserData(restStatus.saksStatus)}
                />

                <Oppgaver
                    oppgaver={oppgaver}
                    leserData={this.leserData(restStatus.oppgaver)}
                />

                <VedleggUtbetalingerLenker
                    vedlegg={vedlegg}
                    utbetalinger={[]}
                />

                <Historikk
                    hendelser={hendelser}
                    leserData={this.leserData(restStatus.hendelser)}
                />
            </>
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
)(SaksStatusView);
