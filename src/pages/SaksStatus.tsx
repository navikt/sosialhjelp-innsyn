import React from "react";
import {connect} from "react-redux";
import {DispatchProps, InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {InnsynsdataSti, InnsynsdataType} from "../redux/innsynsdata/innsynsdataReducer";
import SoknadsStatus from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import Historikk from "../components/historikk/Historikk";

export interface InnsynsdataContainerProps {
    innsynsdata?: InnsynsdataType;
    restStatus?: REST_STATUS;
}

type Props = InnsynsdataContainerProps & DispatchProps;

class SaksStatusView extends React.Component<Props, {}> {

    componentDidMount() {
        const fiksDigisosId: string = "1234";
        this.props.dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS));
        this.props.dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.OPPGAVER));
        this.props.dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SOKNADS_STATUS));
        this.props.dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
    }

    render() {
        const {innsynsdata} = this.props;
        let status = null;
        let saksStatus = null;
        let oppgaver = null;
        let hendelser = null;
        if (innsynsdata && innsynsdata.soknadsStatus) {
            saksStatus = innsynsdata.saksStatus;
            status = innsynsdata.soknadsStatus.status;
            oppgaver = innsynsdata.oppgaver;
            hendelser = innsynsdata.hendelser;
        }
        return (
            <>
                <SoknadsStatus status={status} saksStatus={saksStatus}/>

                <Oppgaver oppgaver={oppgaver}/>

                <Historikk hendelser={hendelser}/>
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
