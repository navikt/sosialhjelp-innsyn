import React from "react";
import {Element, EtikettLiten} from "nav-frontend-typografi";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import { EtikettFokus } from 'nav-frontend-etiketter';
import DatoOgKlokkeslett from "../../components/tidspunkt/DatoOgKlokkeslett";
import DocumentIcon from "../../components/ikoner/DocumentIcon";
import "./sakpanel.less";
import {FormattedMessage} from "react-intl";
import {useDispatch} from "react-redux";
import {push} from "connected-react-router";

const SakPanel: React.FC<{fiksDigisosId: string, tittel: string, status: string, oppdatert: string, key: string, antalNyeOppgaver?: number}> = ({fiksDigisosId, tittel, status, oppdatert, antalNyeOppgaver}) => {

    const dispatch = useDispatch();
    return (
        <LenkepanelBase onClick={(event: any) => {dispatch(push("innsyn/" + fiksDigisosId + "/status"));event.preventDefault()}} className="panel-glippe-over" href="#">
            <div className="sakpanel">
                <div className="sakpanel_text">
                    <DocumentIcon className="document_icon"/>
                    <div className="sakpanel_innhold">
                        <div className="sakpanel_status">
                            <EtikettLiten>
                                {status} ● oppdatert <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true}/>
                            </EtikettLiten>
                        </div>
                        <Element >{tittel}</Element>
                    </div>
                </div>
                <div className="sakpanel_innhold_etikett">
                    {antalNyeOppgaver && (
                        <EtikettFokus><FormattedMessage id="saker.oppgave" values={{antall: antalNyeOppgaver}} /></EtikettFokus>
                    )}
                </div>
            </div>
        </LenkepanelBase>
    );
};

export default SakPanel;
