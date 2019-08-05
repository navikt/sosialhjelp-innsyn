import React from 'react';
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import {Hovedknapp} from "nav-frontend-knapper";
import Lenke from "nav-frontend-lenker";
import PaperClipSlanted from "../components/ikoner/PaperClipSlanted";
import {
    NavTable,
    NavTableBody,
    NavTableCell,
    NavTableHead,
    NavTableHeadCell,
    NavTableRow
} from "../components/navTable/NavTable";
import {AvsnittBoks} from "../components/paneler/layoutKomponenter";

const IconSizedSpacerAll: React.FC = () => <span className="ikon_liten_vedlegg_placeholder_alle" />;
const IconSizedSpacerDesktop: React.FC = () => <span className="ikon_liten_vedlegg_placeholder" />;

const DineVedlegg: React.FC = () => {
    return (
        <Panel>

            <Innholdstittel className="layout_overskriftboks">Dine vedlegg</Innholdstittel>

            <Normaltekst>
                Hvis du har andre vedlegg du ønsker å gi oss, kan de lastes opp her.
            </Normaltekst>

            <AvsnittBoks>
                <Hovedknapp>Ettersend vedlegg</Hovedknapp>
            </AvsnittBoks>

            <NavTable columnWidths={[2,2,1]}>
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
                    {[1,2,3].map((index: number) => { return (
                        <NavTableRow key={index}>
                            <NavTableCell>
                                <PaperClipSlanted className="ikon_liten_vedlegg"/>
                                <Lenke href={"todo"}>IMG8232.JPG</Lenke> (231 kb)
                            </NavTableCell>
                            <NavTableCell>
                                <IconSizedSpacerDesktop/>
                                Lønnsslipp for mai 2019 {index}
                            </NavTableCell>
                            <NavTableCell align="right">
                                <IconSizedSpacerDesktop/>
                                23.03.2019
                            </NavTableCell>
                        </NavTableRow>
                    )})}
                </NavTableBody>
            </NavTable>

            <br/>
            <br/>
            <br/>

        </Panel>
    );
};

export default DineVedlegg;


