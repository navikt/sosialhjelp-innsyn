import React from "react";
import {connect} from "react-redux";
import {DispatchProps, InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {InnsynsdataSti, InnsynsdataType} from "../redux/innsynsdata/innsynsdataReducer";

export interface InnsynsdataContainerProps {
    innsynsdata?: InnsynsdataType;
    restStatus?: REST_STATUS;
}

type Props = InnsynsdataContainerProps & DispatchProps;

class SaksStatusView extends React.Component<Props, {}> {

    componentDidMount() {
        this.props.dispatch(hentInnsynsdata("1234", InnsynsdataSti.SAKSSTATUS));
        this.props.dispatch(hentInnsynsdata("1234", InnsynsdataSti.OPPGAVER));
        this.props.dispatch(hentInnsynsdata("1234", InnsynsdataSti.SOKNADS_STATUS));
        this.props.dispatch(hentInnsynsdata("1234", InnsynsdataSti.HENDELSER));
    }

    render() {
        return (
            <>
                <h1>Din status</h1>
                <p>
                    Alle innsynsdata i redux store:
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
)(SaksStatusView);
