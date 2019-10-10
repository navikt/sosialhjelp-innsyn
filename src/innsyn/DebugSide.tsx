import React from "react";
import {connect} from "react-redux";
import {DispatchProps, InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {InnsynsdataSti, InnsynsdataType} from "../redux/innsynsdata/innsynsdataReducer";

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

class DebugSide extends React.Component<Props, {}> {

    componentDidMount() {
        const soknadId = this.props.match.params.soknadId;
        const fiksDigisosId: string = soknadId === undefined ? "1234" : soknadId;

        this.props.dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS));
        this.props.dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.OPPGAVER));
        this.props.dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SOKNADS_STATUS));
        this.props.dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
        this.props.dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
    }

    render() {
        return (
            <>
                <h1>Din status</h1>
                <p>
                    Alle innsynsdata som mottas fra backend:
                </p>
                <pre>{JSON.stringify(this.props.innsynsdata, null, 4)}</pre>
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
)(DebugSide);
