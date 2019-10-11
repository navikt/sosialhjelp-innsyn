import React from 'react';
import Lenke from "nav-frontend-lenker";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import {
    NavTable,
    NavTableHead,
    NavTableBody,
    NavTableCell,
    NavTableHeadCell,
    NavTableRow
} from "./NavTable";
import {Vedlegg} from "../../redux/innsynsdata/innsynsdataReducer";
import '../lastestriper/lastestriper.less';
import {formatBytes} from "../../utils/formatting";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";

const IconSizedSpacerAll: React.FC = () => <span className="ikon_liten_vedlegg_placeholder_alle" />;
const IconSizedSpacerDesktop: React.FC = () => <span className="ikon_liten_vedlegg_placeholder" />;

interface Props {
    vedlegg: Vedlegg[];
    leserData: boolean;
}

const LastestripeRad = () => (
    <NavTableRow>
        <NavTableCell>
            <span className="lastestriper">
                <span className="lastestripe lastestripe__kort_forsinkelse"/>
            </span>
        </NavTableCell>
        <NavTableCell>
            <span className="lastestriper">
                <span className="lastestripe"/>
            </span>
        </NavTableCell>
        <NavTableCell>
            <span className="lastestriper">
                <span className="lastestripe lastestripe__lang_forsinkelse"/>
            </span>
        </NavTableCell>
    </NavTableRow>
);

const VedleggView: React.FC<Props> = ({vedlegg, leserData}) => {
    return (
            <NavTable columnWidths={[3,2,1]}>
                <NavTableHead>
                    <NavTableHeadCell>
                        <IconSizedSpacerAll/>Filnavn
                    </NavTableHeadCell>
                    <NavTableHeadCell>
                        Beskrivelse
                    </NavTableHeadCell>
                    <NavTableHeadCell align="right">
                        Dato lagt til
                    </NavTableHeadCell>
                </NavTableHead>
                <NavTableBody>
                    {leserData && leserData === true && (
                        <LastestripeRad/>
                    )}
                    {vedlegg.map((vedlegg: Vedlegg, index: number) => { return (
                        <NavTableRow key={index}>
                            <NavTableCell>
                                <PaperClipSlanted className="ikon_liten_vedlegg"/>
                                <Lenke href={"todo"} className="lenke_vedlegg_filnavn">{vedlegg.filnavn}</Lenke>
                                &nbsp;({formatBytes(vedlegg.storrelse, 2)})
                            </NavTableCell>
                            <NavTableCell>
                                <IconSizedSpacerDesktop/>
                                {vedlegg.type}
                            </NavTableCell>
                            <NavTableCell align="right">
                                <IconSizedSpacerDesktop/>
                                <DatoOgKlokkeslett bareDato={true} tidspunkt={vedlegg.datoLagtTil}/>
                            </NavTableCell>
                        </NavTableRow>
                    )})}
                </NavTableBody>
            </NavTable>
    );
};

export default VedleggView;


