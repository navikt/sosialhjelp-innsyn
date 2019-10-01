import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {DispatchProps, InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {
    InnsynsdataSti,
    InnsynsdataType
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

const VedleggsSide: React.FC<Props> = ({match}) => {
    const soknadId = match.params.soknadId;
    const fiksDigisosId: string = soknadId === undefined ? "1234" : soknadId;
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const leserData = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const dispatch = useDispatch();
    const vedlegg = useSelector((state: InnsynAppState) => state.innsynsdata.vedlegg);

    useEffect(() => {
        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG))
    }, [dispatch, fiksDigisosId]);

    return (
        <Panel className="vedlegg_liste_panel">
            <Innholdstittel className="layout_overskriftboks">
                <FormattedMessage id="vedlegg.tittel" />
            </Innholdstittel>
            <Normaltekst>
                <FormattedMessage id="vedlegg.ingress" />
            </Normaltekst>
            <AvsnittBoks>
                <Hovedknapp type="hoved" ><FormattedMessage id="vedlegg.ettersend_knapptekst" /></Hovedknapp>
            </AvsnittBoks>
            <VedleggView vedlegg={ vedlegg } leserData={leserData}/>
        </Panel>
    )
};

export default VedleggsSide;
