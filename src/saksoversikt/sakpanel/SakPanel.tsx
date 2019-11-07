import React, {useEffect} from "react";
import {Element, EtikettLiten} from "nav-frontend-typografi";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import { EtikettFokus } from 'nav-frontend-etiketter';
import DatoOgKlokkeslett from "../../components/tidspunkt/DatoOgKlokkeslett";
import DocumentIcon from "../../components/ikoner/DocumentIcon";
import "./sakpanel.less";
import {FormattedMessage} from "react-intl";
import {useDispatch} from "react-redux";
import {push} from "connected-react-router";
import Lastestriper from "../../components/lastestriper/Lasterstriper";
import {hentSaksdetaljer} from "../../redux/innsynsdata/innsynsDataActions";

interface Props {
    fiksDigisosId: string;
    tittel: string;
    status: string;
    oppdatert: string;
    key: string;
    url: string;
    antallNyeOppgaver?: number;
    harBlittLastetInn?: boolean;
}

const SakPanel: React.FC<Props> = ({fiksDigisosId, tittel, status, oppdatert, url, antallNyeOppgaver, harBlittLastetInn}) => {

    const dispatch = useDispatch();

    const onClick = (event: any) => {
        if(fiksDigisosId === null) {
            window.location.href = url;
        } else {
            dispatch(push("/innsyn/" + fiksDigisosId + "/status"));
            event.preventDefault();
        }
    };

    let underLasting = !harBlittLastetInn;
    let requestId = fiksDigisosId;
    if(fiksDigisosId === null) {
        underLasting = false;
        requestId = "";
    }

    useEffect(() => {
        dispatch(hentSaksdetaljer(requestId))
    }, [dispatch, requestId]);

    return (
        <LenkepanelBase onClick={onClick} className="panel-glippe-over" href="#">
            <div className="sakpanel">
                <div className="sakpanel_text">
                    <DocumentIcon className="document_icon"/>
                    <div className="sakpanel_innhold">
                        <div className="sakpanel_status">

                                {fiksDigisosId !== null && !underLasting && (
                                    <EtikettLiten>
                                        {status} ● oppdatert <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true}/>
                                    </EtikettLiten>
                                )}
                                {fiksDigisosId !== null && underLasting && (
                                    <div className="sakspanel_status_laster">
                                        <Lastestriper linjer={1}/>
                                        <EtikettLiten>
                                            ● oppdatert <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true}/>
                                        </EtikettLiten>
                                    </div>
                                )}
                                {fiksDigisosId === null && (
                                    <EtikettLiten>
                                        SENDT <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true}/>
                                    </EtikettLiten>
                                )}
                        </div>
                        {underLasting && <Lastestriper linjer={1}/>}
                        {!underLasting && <Element >{tittel}</Element>}
                    </div>
                </div>
                <div className="sakpanel_innhold_etikett">
                    {!underLasting && antallNyeOppgaver !== undefined && antallNyeOppgaver >= 1 && (
                        <EtikettFokus>
                            <FormattedMessage id="saker.oppgave" values={{antall: antallNyeOppgaver}} />
                        </EtikettFokus>
                    )}
                </div>
            </div>
        </LenkepanelBase>
    );
};

export default SakPanel;
