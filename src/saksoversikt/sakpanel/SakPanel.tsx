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

interface Props {
    fiksDigisosId: string;
    tittel: string;
    status: string;
    oppdatert: string;
    key: string;
    url: string;
    antalNyeOppgaver?: number;
}

const SakPanel: React.FC<Props> = ({fiksDigisosId, tittel, status, oppdatert, url, antalNyeOppgaver}) => {

    const onClick = (event: any) => {
        if(fiksDigisosId === null) {
            window.location.href = url;
        } else {
            dispatch(push("/innsyn/" + fiksDigisosId + "/status"));
            event.preventDefault();
        }
    };

    const dispatch = useDispatch();
    return (
        <LenkepanelBase onClick={onClick} className="panel-glippe-over" href="#">
            <div className="sakpanel">
                <div className="sakpanel_text">
                    <DocumentIcon className="document_icon"/>
                    <div className="sakpanel_innhold">
                        <div className="sakpanel_status">

                            <EtikettLiten>
                                {fiksDigisosId !== null && <> {status} ● oppdatert <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true}/></>}
                                {fiksDigisosId === null && <> SENDT <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true}/></>}
                            </EtikettLiten>
                        </div>
                        <Element >{tittel}</Element>
                    </div>
                </div>
                <div className="sakpanel_innhold_etikett">
                    {antalNyeOppgaver !== undefined && antalNyeOppgaver >= 1 && (
                        <EtikettFokus><FormattedMessage id="saker.oppgave" values={{antall: antalNyeOppgaver}} /></EtikettFokus>
                    )}
                </div>
            </div>
        </LenkepanelBase>
    );
};

export default SakPanel;
