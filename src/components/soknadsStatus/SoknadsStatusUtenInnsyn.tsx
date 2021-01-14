import React from "react";
import Panel from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import "./soknadsStatus.less";
import {UrlResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import Lastestriper from "../lastestriper/Lasterstriper";

import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import DokumentSendt from "../ikoner/DokumentSendt";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";

interface Props {
    restStatus: REST_STATUS;
    tidspunktSendt: string | null;
    navKontor: string | null;
    filUrl: UrlResponse | null;
}

const SoknadsStatusUtenInnsyn: React.FC<Props> = ({restStatus, tidspunktSendt, navKontor, filUrl}) => {
    let formatertDato =
        tidspunktSendt === null ? null : (
            <DatoOgKlokkeslett bareDato={true} tidspunkt={tidspunktSendt} brukKortMaanedNavn={true} />
        );

    return (
        <Panel className={"panel-uthevet"}>
            <div className="tittel_og_ikon">
                {skalViseLastestripe(restStatus) && <Lastestriper linjer={1} />}
                {restStatus !== REST_STATUS.FEILET && (
                    <>
                        <Innholdstittel>Søknaden er sendt</Innholdstittel>
                        <DokumentSendt />
                    </>
                )}
            </div>

            <div className="status_detalj_panel_info_alert_luft_under">
                {formatertDato && navKontor && filUrl && (
                    <Normaltekst>
                        Sendt den {formatertDato} til {navKontor}{" "}
                        <EksternLenke href={filUrl.link} target="_blank">
                            {filUrl.linkTekst}
                        </EksternLenke>
                    </Normaltekst>
                )}
            </div>
        </Panel>
    );
};

export default SoknadsStatusUtenInnsyn;
