import React, {useState} from 'react';
import Lenke from "nav-frontend-lenker";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import {Vedlegg} from "../../redux/innsynsdata/innsynsdataReducer";
import '../lastestriper/lastestriper.less';
import {formatBytes} from "../../utils/formatting";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import 'nav-frontend-tabell-style';

const IconSizedSpacerAll: React.FC = () => <span className="ikon_liten_vedlegg_placeholder_alle" />;
const IconSizedSpacerDesktop: React.FC = () => <span className="ikon_liten_vedlegg_placeholder" />;

interface Props {
    vedlegg: Vedlegg[];
    leserData: boolean;
    className?: string;
}

const LastestripeRad = () => (
    <tr>
        <td>
            <span className="lastestriper">
                <span className="lastestripe lastestripe__kort_forsinkelse"/>
            </span>
        </td>
        <td>
            <span className="lastestriper">
                <span className="lastestripe"/>
            </span>
        </td>
        <td>
            <span className="lastestriper">
                <span className="lastestripe lastestripe__lang_forsinkelse"/>
            </span>
        </td>
    </tr>
);

// TODO interface Kolonne"filnavn"|"beskrivelse"|"dato" ???
enum Kolonne {
    FILNAVN = "filnavn",
    BESKRIVELSE = "beskrivelse",
    DATO = "dato"
}

const strCompare = (a: string, b: string) => {
  if (a.toLocaleUpperCase() < b.toLocaleUpperCase()) {
      return -1;
  }
  if (a.toLocaleUpperCase() > b.toLocaleUpperCase()) {
      return 1
  }
  return 0;
};

const sorterVedlegg = (vedlegg: Vedlegg[], kolonne: Kolonne, descending: boolean) => {
    switch (kolonne) {
        case Kolonne.DATO:
            return vedlegg.sort((a: Vedlegg, b: Vedlegg) => {
                return descending ?
                    Date.parse(b.datoLagtTil) - Date.parse(a.datoLagtTil) :
                    Date.parse(a.datoLagtTil) - Date.parse(b.datoLagtTil);
            });
        case Kolonne.FILNAVN:
            return vedlegg.sort((a: Vedlegg, b: Vedlegg) => {
                return descending ?
                    strCompare(a.filnavn,b.filnavn) :
                    strCompare(b.filnavn,a.filnavn);
            });
        case Kolonne.BESKRIVELSE:
            return vedlegg.sort((a: Vedlegg, b: Vedlegg) => {
                return descending ?
                    strCompare(a.type,b.type) :
                    strCompare(b.type,a.type);
            });
    }
};

const VedleggView: React.FC<Props> = ({vedlegg, leserData, className}) => {

    const [sortBy, setSortBy] = useState<Kolonne>(Kolonne.DATO);
    const [descending, setDescending] = useState({
        "filnavn": true,
        "beskrivelse": true,
        "dato": true
    });

    const setSort = (newSortBy: Kolonne, newDescending: boolean, event: any) => {
        setSortBy(newSortBy);
        switch (newSortBy) {
            case Kolonne.FILNAVN:
                setDescending({...descending, "filnavn": newDescending});
                break;
            case Kolonne.BESKRIVELSE:
                setDescending({...descending, "beskrivelse": newDescending});
                break;
            default:
                setDescending({...descending, "dato": newDescending});
        }
        event.preventDefault();
    };

    const sorterteVedlegg = sorterVedlegg(vedlegg, sortBy, descending[sortBy]);

    const ariaSort = (kolonne: Kolonne): "descending"|"ascending"|"none" => {
        return (kolonne === sortBy ? (
            descending[kolonne] ? "descending" : "ascending") : "none");
    };

    const classNameAriaSort = (kolonne: Kolonne): string => {
        return (kolonne === sortBy ? (
            descending[kolonne] ? "tabell__th--sortert-desc" : "tabell__th--sortert-asc") : "");
    };
    return (
            <table className={"tabell " + (className ? className : "")}>
                <thead>
                <tr>
                    <th
                        role="columnheader"
                        aria-sort={ariaSort(Kolonne.FILNAVN)}
                        className={classNameAriaSort(Kolonne.FILNAVN)}
                    >
                        <IconSizedSpacerAll/>
                        <Lenke
                            href="#"
                            onClick={(event) => setSort(Kolonne.FILNAVN, !descending[Kolonne.FILNAVN], event)}
                        >
                            Filnavn
                        </Lenke>
                    </th>
                    <th
                        role="columnheader"
                        aria-sort={ariaSort(Kolonne.BESKRIVELSE)}
                        className={classNameAriaSort(Kolonne.BESKRIVELSE)}
                    >
                        <Lenke
                            href="#"
                            onClick={(event) => setSort(Kolonne.BESKRIVELSE, !descending[Kolonne.BESKRIVELSE], event)}
                        >
                            Beskrivelse
                        </Lenke>
                    </th>
                    <th
                        role="columnheader"
                        aria-sort={ariaSort(Kolonne.DATO)}
                        className={classNameAriaSort(Kolonne.DATO)}
                        align="right"
                    >
                        <Lenke
                            href="#"
                            onClick={(event) => setSort(Kolonne.DATO, !descending[Kolonne.DATO], event)}
                        >
                            Dato lagt til
                        </Lenke>
                    </th>
                </tr>
                </thead>
                <tbody>
                    {leserData && leserData === true && (
                        <LastestripeRad/>
                    )}
                    {sorterteVedlegg.map((vedlegg: Vedlegg, index: number) => { return (
                        <tr key={index}>
                            <td
                                className={sortBy === Kolonne.FILNAVN ? "tabell__td--sortert" : ""}
                            >
                                <PaperClipSlanted className="ikon_liten_vedlegg"/>
                                <Lenke href={"todo"} className="lenke_vedlegg_filnavn">{vedlegg.filnavn}</Lenke>
                                &nbsp;({formatBytes(vedlegg.storrelse, 2)})
                            </td>
                            <td
                                className={sortBy === Kolonne.BESKRIVELSE ? "tabell__td--sortert" : ""}
                            >
                                <IconSizedSpacerDesktop/>
                                {vedlegg.type}
                            </td>
                            <td
                                align="right"
                                className={sortBy === Kolonne.DATO ? "tabell__td--sortert" : ""}
                            >
                                <IconSizedSpacerDesktop/>
                                <DatoOgKlokkeslett bareDato={true} tidspunkt={vedlegg.datoLagtTil}/>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
    );
};

export default VedleggView;


