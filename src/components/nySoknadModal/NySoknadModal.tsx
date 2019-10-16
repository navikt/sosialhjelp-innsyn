import React, {useState} from "react";
import {Normaltekst, Systemtittel} from "nav-frontend-typografi";
import {Knapp} from "nav-frontend-knapper";
import BildeModal from "../bildeModal/BildeModal";
import "./nySoknadModal.less"
import NavAutocomplete, {Suggestion} from "./navAutocomplete/NavAutcomplete";
import Veilederpanel from 'nav-frontend-veilederpanel';
import VeilederIkon from "../ikoner/VeilederIkon";
import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";
import Lenke from "nav-frontend-lenker";
import useKommuneNrService from "./service/useKommuneNrService";
import useTilgjengeligeKommunerService from "./service/useTilgjengeligeKommunerService";

const NySoknadModal: React.FC<{ synlig: boolean, onRequestClose: () => void }> = ({synlig, onRequestClose}) => {

    const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
    const [visAlertStripe, setVisAlertstripe] = useState<boolean | undefined>(false);
    const kommunerService = useKommuneNrService();
    const tilgjengeligeKommunerService = useTilgjengeligeKommunerService();

    const onSelect = (suggestion: Suggestion) => {
        // TODO Slett
        console.log("selected " + JSON.stringify(suggestion, null, 8));
        setCurrentSuggestion(suggestion);
    };

    let soknadTilgjengelig: boolean = false;
        // currentSuggestion !== null &&
        // tilgjengeligeKommunerService.status === 'loaded' &&
        // tilgjengeligeKommunerService.payload.results.includes(currentSuggestion.key);

    console.log("currentSuggestion: " + JSON.stringify(currentSuggestion, null, 8));
    // console.log("tilgjengeligeKommunerService.payload.results: " + JSON.stringify(tilgjengeligeKommunerService.payload, null, 8))
    // if (currentSuggestion !== null && tilgjengeligeKommunerService.status === 'loaded') {
    //     console.log("debug: ");
    //     tilgjengeligeKommunerService.payload.results.map((nummer: string) => {
    //
    //         if (nummer === currentSuggestion.key) {
    //             soknadTilgjengelig = true;
    //             // return nummer;
    //         }
    //         return null;
    //     })
    // }

    const onButtonClick = (event: any) => {
        if (currentSuggestion && soknadTilgjengelig) {
            // TODO Ta bruker til søknadsapplikasjonen.
            console.log("TODO: Ta bruker til søknadsapplikasjonen.");
            event.preventDefault();
        } else {
            setVisAlertstripe(true);
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
    const urlDittNavKontor = "https://www.nav.no/" +
        "no/NAV+og+samfunn/Kontakt+NAV/Relatert+informasjon/finn-ditt-nav-kontor--353421";

    return (
        <BildeModal
            className="modal vedlegg_bilde_modal"
            isOpen={synlig}
            onRequestClose={() => onRequestClose()}
            closeButton={true}
            contentLabel="Vedlegg"
            shouldCloseOnOverlayClick={true}
        >

            {/*Debug kode start*/}
            <div>
                {kommunerService.status === 'loading' && (
                    <div className="loader-container">
                        Leser inn kommuner...
                    </div>
                )}
                {kommunerService.status === 'loaded' && (
                    <div>{kommunerService.payload.results.length} kommuner lest inn</div>
                )}
                {kommunerService.status === 'error' && (
                    <div>Beklager. Teknisk feil.</div>
                )}
                {tilgjengeligeKommunerService.status === 'loaded' && (
                    <pre>{JSON.stringify(tilgjengeligeKommunerService.payload.results, null, 8)}</pre>
                )}
            </div>
            {/*Slutt debug kode*/}


            <div className="nySoknadModal">
                <Systemtittel>Ny søknad</Systemtittel>

                <Veilederpanel
                    fargetema={fargetema}
                    svg={<VeilederIkon/>}
                    type={"normal"}
                    kompakt={false}
                >

                    {currentSuggestion && soknadTilgjengelig && (
                        <Normaltekst>
                            Du kan søke digitalt i {currentSuggestion.value} kommune.
                            Hvis du ikke har penger til det aller mest nødvendige, som mat,
                            bør du &nbsp;
                            <Lenke href={urlDittNavKontor}>kontakte NAV-kontoret ditt</Lenke>
                            &nbsp;før du sender inn søknaden.
                        </Normaltekst>
                    )}
                    {currentSuggestion && !soknadTilgjengelig && (
                        <Normaltekst>
                            Du kan dessverre ikke søke digitalt i {currentSuggestion.value}. Ta kontakt
                            med &nbsp;
                            <Lenke href={urlDittNavKontor}>NAV-kontoret ditt</Lenke>
                            &nbsp; for å få papirskjema.
                        </Normaltekst>
                    )}


                    {currentSuggestion === null && (
                        <Normaltekst>
                            Sjekk om du kan søke digitalt i din kommune
                        </Normaltekst>
                    )}
                </Veilederpanel>

                {kommunerService.status === 'loaded' && (
                    <NavAutocomplete
                        placeholder="Søk etter din kommune"
                        suggestions={kommunerService.payload.results}
                        ariaLabel="Søk etter din kommune"
                        id="kommunesok"
                        onSelect={(suggestion: Suggestion) => onSelect(suggestion)}
                        onReset={() => onReset()}
                    />
                )}


                {visAlertStripe && (
                    <AlertStripeAdvarsel>Du må velge en kommune før du kan gå videre.</AlertStripeAdvarsel>
                )}

                <Knapp
                    type="hoved"
                    onClick={(event: any) => onButtonClick(event)}
                >
                    Søk digital
                </Knapp>

                {/*TODO Finn lenke for de som ikke vil søke digitial*/}
                <Normaltekst>
                    <Lenke href="todo">Jeg skal ikke søke digitalt</Lenke>
                </Normaltekst>

            </div>

        </BildeModal>
    );
};

export default NySoknadModal;
