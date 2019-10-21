import React, {useState} from "react";
import {Normaltekst, Undertittel} from "nav-frontend-typografi";
import {Knapp} from "nav-frontend-knapper";
import NavAutocomplete, {Suggestion} from "./navAutocomplete/NavAutcomplete";
import Veilederpanel from 'nav-frontend-veilederpanel';
import VeilederIkon from "../ikoner/VeilederIkon";
import Lenke from "nav-frontend-lenker";
import useKommuneNrService from "./service/useKommuneNrService";
import useTilgjengeligeKommunerService from "./service/useTilgjengeligeKommunerService";
import {tilgjengeligeKommunerBackup} from "./service/tilgjengeligKommuner";
import EnkelModal from "./EnkelModal";
import "./nySoknadModal.less"

const sokPaaPapirUrl = "https://www.nav.no/no/Person/" +
    "Flere+tema/Sosiale+tjenester/%C3%B8konomisk-sosialhjelp--87469#chapter-4";

const NySoknadModal: React.FC<{ synlig: boolean, onRequestClose: () => void }> = ({synlig, onRequestClose}) => {

    const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
    const [visFeilmelding, setVisFeilmelding] = useState<boolean | undefined>(false);
    const kommunerService = useKommuneNrService();
    const tilgjengeligeKommunerService = useTilgjengeligeKommunerService();

    const onSelect = (suggestion: Suggestion) => {
        setCurrentSuggestion(suggestion);
    };

    let soknadTilgjengelig: boolean = false;
    if (currentSuggestion !== null) {
        // Bruker har valgt en kommune. Sjekk om det er mulig å søke.
        debugger;
        if (tilgjengeligeKommunerService.status === 'loaded') {
            soknadTilgjengelig = tilgjengeligeKommunerService.payload.results !== undefined &&
                tilgjengeligeKommunerService.payload.results.includes(currentSuggestion.key);

            console.log("tilgjengeligeKommuner: " +
                JSON.stringify(tilgjengeligeKommunerService.payload.results, null, 8))

        } else if (tilgjengeligeKommunerService.status === 'error') {
            // Backupløsning i tilfelle vi får CORS problemer når vi snakker med backend
            soknadTilgjengelig = tilgjengeligeKommunerBackup.includes(currentSuggestion.key)
        }
    }

    const onButtonClick = (event: any) => {
        if (currentSuggestion && soknadTilgjengelig) {
            const soknadUrl = "/sosialhjelp/soknad/informasjon?kommuneId=" + currentSuggestion.key;
            window.location.href = soknadUrl;
        } else {
            setVisFeilmelding(true);
            event.preventDefault();
        }
    };

    const onReset = () => {
        setCurrentSuggestion(null);
    };

    let fargetema: 'normal' | 'suksess' | 'advarsel' | 'feilmelding' = "normal";
    if (currentSuggestion) {
        fargetema = soknadTilgjengelig ? "suksess" : "feilmelding";
    }

    if (kommunerService.status === 'loaded' && kommunerService.payload.results !== undefined) {
        console.log(kommunerService.payload.results.length + " kommuner lest inn");
    }
    if (tilgjengeligeKommunerService.status === 'loaded' && tilgjengeligeKommunerService.payload.results !== undefined) {
        console.log(tilgjengeligeKommunerService.payload.results.length + " tilgjengelige kommunenummer lest inn");
    }

    return (
        <EnkelModal
            className="modal vedlegg_bilde_modal"
            isOpen={synlig}
            onRequestClose={() => onRequestClose()}
            closeButton={true}
            contentLabel="Vedlegg"
            shouldCloseOnOverlayClick={true}
        >
            <div className="nySoknadModal">
                <Veilederpanel
                    fargetema={fargetema}
                    svg={<VeilederIkon/>}
                    type={"normal"}
                    kompakt={false}
                >
                    {currentSuggestion && soknadTilgjengelig && (
                        <>
                            <Undertittel className="nySoknadModal__tittel">
                                Du kan søke digitalt i {currentSuggestion.value} kommune.
                            </Undertittel>
                            <Normaltekst className="nySoknadModal__normaltekst">
                                Din kommune
                            </Normaltekst>
                        </>
                    )}
                    {currentSuggestion && !soknadTilgjengelig && (
                        <>
                            <Undertittel className="nySoknadModal__tittel">
                                {currentSuggestion.value} kommune kan ikke ta i mot digitale søknader ennå.
                                Du kan søke på papirskjema.
                            </Undertittel>
                            <Normaltekst className="nySoknadModal__normaltekst">
                                Din kommune
                            </Normaltekst>
                        </>
                    )}

                    {currentSuggestion === null && (
                        <>
                            <Undertittel className="nySoknadModal__tittel">
                                Sjekk om du kan søke digitalt i kommunen din
                            </Undertittel>
                            <Normaltekst className="nySoknadModal__normaltekst">
                                Din kommune
                            </Normaltekst>
                        </>
                    )}

                    {kommunerService.status === 'loaded' && (
                        <NavAutocomplete
                            placeholder="Skriv kommunenavn"
                            suggestions={kommunerService.payload.results}
                            ariaLabel="Søk etter kommunenavn"
                            id="kommunesok"
                            onSelect={(suggestion: Suggestion) => onSelect(suggestion)}
                            onReset={() => onReset()}
                            feil={(visFeilmelding && currentSuggestion === null )?
                                "Du må skrive inn navnet på kommunen din før du kan gå videre" : undefined
                            }
                        />
                    )}

                    <div className="knappOgLenke">
                            <Knapp
                                type="hoved"
                                onClick={(event: any) => onButtonClick(event)}
                            >
                                Søk digital
                            </Knapp>
                            <Normaltekst>
                                <b><Lenke href={sokPaaPapirUrl}>Søk på papirskjema</Lenke></b>
                            </Normaltekst>

                    </div>
                </Veilederpanel>

            </div>

        </EnkelModal>
    );
};

export default NySoknadModal;
