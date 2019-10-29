import React, {useState} from "react";
import {Normaltekst, Undertittel} from "nav-frontend-typografi";
import {Knapp} from "nav-frontend-knapper";
import NavAutocomplete, {Suggestion} from "./navAutocomplete/NavAutcomplete";
import Veilederpanel from 'nav-frontend-veilederpanel';
import VeilederIkon from "../ikoner/VeilederIkon";
import Lenke from "nav-frontend-lenker";
import useKommuneNrService from "./service/useKommuneNrService";
import useTilgjengeligeKommunerService, {
    finnTilgjengeligKommune,
    KommuneTilgjengelighet
} from "./service/useTilgjengeligeKommunerService";
import EnkelModal from "./EnkelModal";
import "./nySoknadModal.less"
import AdvarselIkon from "./AdvarselIkon";
import {REST_STATUS} from "../../utils/restUtils";
import KryssIkon from "./KryssIkon";
import {FormattedMessage} from "react-intl";
import NySoknadIntlProvider from "./NySoknadIntlProvider";

const sokPaaPapirUrl = "https://www.nav.no/sosialhjelp/slik-soker-du";

const NySoknadModal: React.FC<{ synlig: boolean, onRequestClose: () => void }> = ({synlig, onRequestClose}) => {

    const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
    const [soknadTilgjengelig, setSoknadTilgjengelig] = useState<boolean>(false);
    const [visFeilmelding, setVisFeilmelding] = useState<boolean | undefined>(false);
    const [midlertidigNede, setMidlertidigNede] = useState<boolean | undefined>(false);
    const kommunerService = useKommuneNrService();
    const tilgjengeligeKommunerService = useTilgjengeligeKommunerService();

    const onSelect = (suggestion: Suggestion) => {
        onReset();
        if (tilgjengeligeKommunerService.restStatus === REST_STATUS.OK) {
            let kommune: KommuneTilgjengelighet | undefined;
            kommune = finnTilgjengeligKommune(tilgjengeligeKommunerService.payload.results, suggestion.key);
            if (kommune !== undefined) {
                setSoknadTilgjengelig(kommune.kanMottaSoknader);
                setMidlertidigNede(kommune.harMidlertidigDeaktivertMottak);
            }
        }
        setCurrentSuggestion(suggestion);
    };

    const onClose = () => {
        onReset();
        onRequestClose();
    };

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
        setVisFeilmelding(false);
        setSoknadTilgjengelig(false);
        setMidlertidigNede(false);
    };

    let fargetema: 'normal' | 'suksess' | 'advarsel' | 'feilmelding' = "normal";

    if (currentSuggestion) {
        fargetema = soknadTilgjengelig ? "suksess" : "advarsel";
        if (midlertidigNede) {
            fargetema = 'feilmelding';
        }
    }

    let PanelIkon: React.FC = () => <VeilederIkon/>;
    if (currentSuggestion) {
        if (!soknadTilgjengelig) {
            PanelIkon = () => <AdvarselIkon/>;
        }
        if (midlertidigNede) {
            PanelIkon = () => <KryssIkon/>;
        }
    }

    return (
        <NySoknadIntlProvider>
            <EnkelModal
                className="modal vedlegg_bilde_modal"
                isOpen={synlig}
                onRequestClose={() => onClose()}
                closeButton={true}
                contentLabel="Vedlegg"
                shouldCloseOnOverlayClick={true}
            >
                <div className={
                    "nySoknadModal " +
                    (currentSuggestion && (!soknadTilgjengelig || midlertidigNede) ?
                            "nySoknadModal--soknadIkkeTilgjengeligAdvarsel" : ""
                    )
                }>
                    <Veilederpanel
                        fargetema={fargetema}
                        svg={<PanelIkon/>}
                        type={"normal"}
                        kompakt={false}
                    >
                        {currentSuggestion && (
                            <>
                                {midlertidigNede && (
                                    <>
                                        <Undertittel className="nySoknadModal__tittel">
                                            {currentSuggestion.value} <FormattedMessage id={"nySoknadModal.midlertidig_nede"} />
                                        </Undertittel>
                                        <Normaltekst className="nySoknadModal__normaltekst">
                                            <FormattedMessage id={"nySoknadModal.din_kommune"}/>
                                        </Normaltekst>
                                    </>
                                )}
                                {!midlertidigNede && (
                                    <>
                                        {soknadTilgjengelig && (
                                            <>
                                                <Undertittel className="nySoknadModal__tittel">
                                                    <FormattedMessage id={"nySoknadModal.soknad_tilgjengelig.undertittel.part1"} />
                                                    {currentSuggestion.value}
                                                    <FormattedMessage id={"nySoknadModal.soknad_tilgjengelig.undertittel.part2"} />
                                                </Undertittel>
                                                <Normaltekst className="nySoknadModal__normaltekst">
                                                    <FormattedMessage id={"nySoknadModal.din_kommune"} />
                                                </Normaltekst>
                                            </>
                                        )}
                                        {!soknadTilgjengelig && (
                                            <>
                                                <Undertittel className="nySoknadModal__tittel">
                                                    {currentSuggestion.value} <FormattedMessage id={"nySoknadModal.soknad_ikke_tilgjengelig"} />
                                                </Undertittel>
                                                <Normaltekst className="nySoknadModal__normaltekst">
                                                    <FormattedMessage id={"nySoknadModal.din_kommune"} />
                                                </Normaltekst>
                                            </>
                                        )}
                                    </>
                                )}

                            </>
                        )}


                        {currentSuggestion === null && (
                            <>
                                <Undertittel className="nySoknadModal__tittel">
                                    <FormattedMessage id={"nySoknadModal.current_suggestion_null"} />
                                </Undertittel>
                                <Normaltekst className="nySoknadModal__normaltekst">
                                    <FormattedMessage id={"nySoknadModal.din_kommune"} />
                                </Normaltekst>
                            </>
                        )}

                        {kommunerService.restStatus === REST_STATUS.OK && (
                            <NavAutocomplete
                                placeholder="Skriv kommunenavn"
                                suggestions={kommunerService.payload.results}
                                ariaLabel="Søk etter kommunenavn"
                                id="kommunesok"
                                onSelect={(suggestion: Suggestion) => onSelect(suggestion)}
                                onReset={() => onReset()}
                                feil={(visFeilmelding && currentSuggestion === null) ?
                                    "nySoknadModal.feil_tom_kommunenavn" : undefined
                                }
                            />
                        )}

                        <div className="knappOgLenke">
                            <Knapp
                                type="hoved"
                                onClick={(event: any) => onButtonClick(event)}
                            >
                                <FormattedMessage id="nySoknadModal.sok_digitalt"/>
                            </Knapp>
                            <Normaltekst>
                                <b>
                                    <Lenke href={sokPaaPapirUrl}>
                                        <FormattedMessage id="nySoknadModal.skal_ikke_soke_digitalt"/>
                                    </Lenke>
                                </b>
                            </Normaltekst>

                        </div>
                    </Veilederpanel>

                </div>

            </EnkelModal>
        </NySoknadIntlProvider>
    );
};

export default NySoknadModal;
