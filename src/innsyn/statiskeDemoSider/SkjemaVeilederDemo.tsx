import React, {useState} from "react";
import NySoknadModal from "../../components/nySoknadModal/NySoknadModal";
import Lenke from "nav-frontend-lenker";

/*
*  Mockup av skjemaveilderside
* */
const SkjemaVeilederDemo: React.FC = () => {

    const [visKommunesok, setVisKommunesok] = useState<boolean>(true);
    const onCloseKommunesok = (): void => {
        setVisKommunesok(false);
    };

    const visKommuneSok = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        setVisKommunesok(true);
        event.preventDefault();
    };

    return (
        <div>
            <div className="side__wrapper" id="maincontent">
                <div className="innhold__container">
                    <div className="hovedbanner"
                         style={{
                             backgroundColor: "rgb(155, 208, 176)",
                             borderColor: "rgb(56, 161, 97)",
                             padding: "2rem"
                         }}><p
                        className="typo-etikett-liten litenEtikett">Sosiale tjenester</p><h2
                        className="typo-systemtittel">Økonomisk sosialhjelp</h2></div>
                    <div className="ekspandertSoknadsPanel">
                        <div className="ekspanderbartPanel ekspanderbartPanel--apen">
                            <button className="ekspanderbartPanel__hode" aria-expanded="true" type="button"
                                    aria-controls="0284716719-14962-6251-1194-15568714613474">
                                <div className="ekspanderbartPanel__flex-wrapper" style={{padding: "2rem 2rem 0 2rem"}}>
                                    <div className="ekspanderbartPanel__headingInnhold"><h2
                                        className="typo-undertittel">Søknad om økonomisk sosialhjelp</h2></div>
                                    <span className="ekspanderbartPanel__indikator"></span></div>
                            </button>
                            <div className="ReactCollapse--collapse" id="0284716719-14962-6251-1194-15568714613474"
                                 style={{height: "auto"}}>
                                <div className="ReactCollapse--content" style={{padding: "0 2rem 2rem 2rem"}}>
                                    <article className="ekspanderbartPanel__innhold">
                                        <div className="soknadsobjekt">
                                            <div className="soknadsobjekt__innhold">
                                                <div>
                                                    <div className="typo-normal soknadsobjekt__beskrivelse">
                                                        <div>
                                                            <p>Hvis du ikke har mulighet til å sende inn søknad om
                                                                økonomisk sosialhjelp elektronisk, må du ta kontakt med
                                                                det
                                                                lokale NAV-kontoret ditt. NAV-kontoret kan hjelpe deg
                                                                med
                                                                informasjon og veiledning.</p><p>Hvis du søker for andre
                                                            enn
                                                            deg selv kan du ikke søke elektronisk.</p><p><a
                                                            href="https://tjenester.nav.no/esso/saml2/jsp/spSSOInit.jsp?metaAlias=/sp&amp;idpEntityID=idporten.difi.no-v4&amp;NameIDFormat=transient&amp;AuthLevel=4&amp;goto=https://tjenester.nav.no/saksoversikt/app/ettersending"
                                                            className="lenke">Ettersend </a> dokumentasjon til en
                                                            tidligere innsendt søknad.</p><p>Se informasjon om <a
                                                            href="https://tjenester.nav.no/veivisersosialhjelp/"
                                                            className="lenke">økonomisk sosialhjelp</a>

                                                            <br/>
                                                            <br/>
                                                            <NySoknadModal
                                                                synlig={visKommunesok}
                                                                onRequestClose={() => onCloseKommunesok()}
                                                            />
                                                            <Lenke href="#" onClick={(event) => visKommuneSok(event)}>
                                                                Sjekk om du kan søke digitalt i kommunen din.
                                                            </Lenke>
                                                        </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="knapper-wrapper litenavstand"><a
                                                href="https://www.nav.no/sosialhjelp/soknad/informasjon"
                                                className="knapp knapp--hoved">Søk digitalt</a></div>
                                        </div>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkjemaVeilederDemo;
