import React from "react";
import {Element, EtikettLiten} from "nav-frontend-typografi";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import { EtikettFokus } from 'nav-frontend-etiketter';
import DatoOgKlokkeslett from "../../components/tidspunkt/DatoOgKlokkeslett";
import DocumentIcon from "../../components/ikoner/DocumentIcon";
import "./sakpanel.less";

const SakPanel: React.FC<{tittel: string, status: string, oppdatert: string, etikett?: string}> = ({tittel, status, oppdatert, etikett}) => {
    return (
        <LenkepanelBase href="#todod" className="panel-glippe-over">
            <div className="sakpanel">
                <DocumentIcon className="document_icon"/>

                <div className="sakpanel_innhold">
                    <div className="sakpanel_status">
                        <EtikettLiten>
                            {status} ● oppdatert <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true}/>
                        </EtikettLiten>
                    </div>
                    <Element >{tittel}</Element>
                </div>
                <div className="sakpanel_innhold_etikett">
                    {etikett && (
                        <EtikettFokus>{etikett}</EtikettFokus>
                    )}
                </div>
            </div>
        </LenkepanelBase>
    );
}

export default SakPanel;
