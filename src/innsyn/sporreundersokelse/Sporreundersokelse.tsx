import {BodyLong, Button, Cell, Grid, Heading, Panel, Radio, RadioGroup} from "@navikt/ds-react";
import styled from "styled-components";
import React, {useEffect, useState} from "react";
import {logAmplitudeEvent} from "../../utils/amplitude";
import {RadioGruppe} from "../../components/sporreundersokelse/RadioGruppe";
import Brodsmulesti, {UrlType} from "../../components/brodsmuleSti/BrodsmuleSti";
import {useDispatch, useSelector} from "react-redux";
import {push} from "connected-react-router";
import {InnsynAppState} from "../../redux/reduxTypes";
import {fetchToJson} from "../../utils/restUtils";
import {settSisteKommune} from "../../redux/innsynsdata/innsynsdataReducer";
import {Cookies, withCookies} from "react-cookie";

const StyledPanel = styled(Panel)`
    margin-top: 2rem;
    padding-top: 2rem;

    @media screen and (min-width: 641px) {
        padding: 2rem 80px 2rem 80px;
    }
`;

const StyledHeader = styled(Heading)`
    margin-bottom: 2rem;
`;

const StyledGrid = styled(Grid)`
    margin-bottom: 2rem;
`;

export const StyledRadioGroup = styled(RadioGroup)`
    margin-bottom: 2rem;
`;

export const ButtonWrapper = styled.div`
    flex-direction: row;
    gap: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 2rem;
    width: 80%;
    align-self: center;
    flex-basis: 80%;
    button,
    a {
        flex-grow: 1;
        min-width: 4.5rem;
    }
`;

const Sporreundersokelse = (props: {cookies: Cookies}) => {
    const [questions, setQuestions] = useState<Record<string, string>>({});

    const dispatch = useDispatch();

    const kommunenavn = useSelector((state: InnsynAppState) => state.innsynsdata.sisteKommune);

    useEffect(() => {
        if (kommunenavn.length === 0) {
            fetchToJson("/innsyn/sisteSak").then((sak: any) => dispatch(settSisteKommune(sak?.kommunenummer)));
        }
    }, [kommunenavn, dispatch]);

    const handleOnClick = async () => {
        props.cookies.set("sosialhjelp-meldinger-undersokelse", true);
        logToAmplitude();
        dispatch(push("/innsyn"));
    };

    const handleAvbryt = async () => {
        props.cookies.set("sosialhjelp-meldinger-undersokelse", true);
        dispatch(push("/innsyn"));
    };

    const updateQuestions = (key: string, value: string) => {
        const updatedQuestions = {...questions};
        updatedQuestions[key] = value;
        setQuestions(updatedQuestions);
    };

    const logToAmplitude = () => {
        logAmplitudeEvent("Dialog bruker: Spørreundersøkelse (Kontrollgruppe)", {
            ...questions,
            kommunenavn: kommunenavn,
        });
    };

    return (
        <>
            <Brodsmulesti
                foreldreside={{
                    tittel: "Økonomisk sosialhjelp",
                    path: "/sosialhjelp/innsyn/",
                    urlType: UrlType.ABSOLUTE_PATH,
                }}
                tittel="Spørreundersøkelse"
                tilbakePilUrlType={UrlType.ABSOLUTE_PATH}
                className="breadcrumbs__luft_rundt"
            />
            <StyledPanel>
                <StyledHeader level={"2"} size={"large"}>
                    Dine erfaringer med NAV og sosialtjenesten
                </StyledHeader>
                <StyledGrid>
                    <Cell xs={12}>
                        <BodyLong>
                            For å kunne forbedre løsningene på nav.no, så ønsker vi å lære mer om dine erfaringer med
                            NAV og spesielt sosialtjenesten. Vi spør derfor om du kan svare på spørsmålene under.
                        </BodyLong>
                        <BodyLong>
                            Det er helt anonymt og valgfritt å delta. Vi beregner ca 4 minutter for å svare på alle
                            spørsmålene.
                        </BodyLong>
                    </Cell>
                    <Cell xs={12}>
                        <Heading size="medium" level="3" spacing>
                            1. Hvor godt forstår du norsk? / How well do you understand the Norwegian?
                        </Heading>
                        <StyledRadioGroup legend="" onChange={(value) => updateQuestions("sprak", value)}>
                            <Radio value="1">Liten forståelse / Low understanding</Radio>
                            <Radio value="2">Middels forståelse / Medium understanding</Radio>
                            <Radio value="3">God forståelse / Good understanding</Radio>
                            <Radio value="4">Veldig god forståelse / Very good understanding</Radio>
                            <Radio value="5">Morsmål eller flytende forståelse / Fluent or native understanding</Radio>
                        </StyledRadioGroup>
                        <Heading size="medium" level="3" spacing>
                            2. Hvilket av de følgende utsagnene passer best for deg?
                        </Heading>
                        <StyledRadioGroup
                            legend="I løpet av de siste seks månedene har jeg stort sett:"
                            onChange={(value) => updateQuestions("veileder_antall", value)}
                        >
                            <Radio value="1">Forholdt meg til én NAV-veileder</Radio>
                            <Radio value="2">Forholdt meg til flere NAV-veiledere, og syntes det er greit</Radio>
                            <Radio value="3">Forholdt meg til flere NAV-veiledere, og syntes det er vanskelig</Radio>
                            <Radio value="4">Ingen av utsagnene / vet ikke / ønsker ikke å svare</Radio>
                        </StyledRadioGroup>
                        <Heading size="medium" level="3" spacing>
                            3. Hvor enig eller uenig er du i følgende?
                        </Heading>
                        <RadioGruppe
                            legend="Jeg misliker måten veilederen min for sosialhjelp snakker eller skriver til meg på"
                            onChange={(value) => updateQuestions("veileder_snakker", value)}
                            zebra
                        />
                        <RadioGruppe
                            legend="Jeg blir møtt med respekt av veilederen min for sosialhjelp"
                            onChange={(value) => updateQuestions("veileder_respekt", value)}
                        />
                        <RadioGruppe
                            legend="Sosialtjenesten i NAV behandler folk rettferdig"
                            onChange={(value) => updateQuestions("sosialtjeneste_rettferdig", value)}
                            zebra
                        />
                        <RadioGruppe
                            legend="Det er ofte flaks og tilfeldigheter som avgjør hva man får av sosialtjenesten i NAV"
                            onChange={(value) => updateQuestions("sosialtjeneste_flaks", value)}
                        />
                        <RadioGruppe
                            legend="Jeg stoler på det veilederen min for sosialhjelp sier"
                            onChange={(value) => updateQuestions("veileder_tillit", value)}
                            zebra
                        />
                        <RadioGruppe
                            legend="Det er enkelt å få kontakt med veilederen min for sosialhjelp når jeg har behov for det"
                            onChange={(value) => updateQuestions("veileder_kontakt", value)}
                        />
                        <RadioGruppe
                            legend="Det tar for lang tid å komme i kontakt med veilederen min for sosialhjelp"
                            onChange={(value) => updateQuestions("veileder_lang_tid", value)}
                            zebra
                        />
                        <RadioGruppe
                            legend="Jeg får god service fra veilederen min for sosialhjelp"
                            onChange={(value) => updateQuestions("veileder_service", value)}
                        />
                        <RadioGruppe
                            legend="Min veileder for sosialhjelp tar initiativ til å gi meg god informasjon, uten at jeg må spørre om dette"
                            onChange={(value) => updateQuestions("veileder_initiativ", value)}
                            zebra
                        />
                        <RadioGruppe
                            legend="Det er for mange måter å komme i kontakt med NAV på (f.eks. telefon og chat-løsninger)"
                            onChange={(value) => updateQuestions("mange_kanaler", value)}
                        />
                        <RadioGruppe
                            legend="Det er vanskelig å nå riktig veileder, fordi det er for mange måter å komme i kontakt med NAV på"
                            onChange={(value) => updateQuestions("veileder_riktig", value)}
                            zebra
                        />
                        <RadioGruppe
                            legend="Så lenge jeg får tak i veilederen min, så er det ikke noe problem at det er så mange måter å komme i kontakt med NAV på"
                            onChange={(value) => updateQuestions("veileder_riktig_mange_kanaler", value)}
                        />
                    </Cell>
                </StyledGrid>

                <ButtonWrapper>
                    <Button onClick={handleOnClick}>Fullfør</Button>
                    <Button variant="secondary" onClick={handleAvbryt}>
                        Avbryt
                    </Button>
                </ButtonWrapper>
            </StyledPanel>
        </>
    );
};
export default withCookies(Sporreundersokelse);
