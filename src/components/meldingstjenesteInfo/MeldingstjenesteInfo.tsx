import React from "react";
import {Button, SpeechBubble} from "@navikt/ds-react";
import NavLogo from "./NavLogo";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import styled from "styled-components";
import {Close} from "@navikt/ds-icons";
import {DialogStatus} from "../../redux/innsynsdata/innsynsdataReducer";

const StyledSnakkeboble = styled(SpeechBubble)`
    svg {
        padding: 0 3px;
    }
`;
const MeldingsInnhold = styled(SpeechBubble.Bubble)`
    position: relative;
    padding-right: 48px;
    border: 1px solid #a0a0a0;
`;

const Lukkeknapp = styled(Button).attrs({variant: "tertiary"})`
    position: absolute;
    top: 0;
    right: 0;
    margin: 0 0 8px 8px;
`;

export const useLocalStorageState = (key: string, initialValue = "") => {
    const [value, setValue] = React.useState<string>(() => window.localStorage.getItem(key) || initialValue);

    React.useEffect(() => {
        window.localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue] as const;
};

export const getVisMeldingsInfo = (dialogStatus: DialogStatus | undefined, harLukketInfo: "true" | "false") => {
    // Boks vises når den ikke har blitt lukket, man har tilgang til dialog og man har ikke sendt melding, men har onboardet

    return (
        harLukketInfo === "false" &&
        dialogStatus?.tilgangTilDialog &&
        !dialogStatus?.harSendtMelding &&
        dialogStatus?.harFullfortOnboarding
    );
};

interface Props {
    lukkInfo: () => void;
}
const MeldingstjenesteInfo = (props: Props) => {
    const fornavn = useSelector((state: InnsynAppState) => state.innsynsdata.fornavn);

    const lukkInfo = () => {
        props.lukkInfo();
    };

    return (
        <StyledSnakkeboble
            position={"left"}
            illustration={<NavLogo titleId="meldingFraNav" className="navLogo" />}
            illustrationBgColor={"#262626"}
            backgroundColor="#FFF"
        >
            <MeldingsInnhold backgroundColor="#FFF">
                <Lukkeknapp onClick={lukkInfo}>
                    <Close />
                </Lukkeknapp>
                <span>
                    {`Hei ${fornavn}. Har du spørsmål til søknaden din eller ønsker å snakke med veilderen din? Det kan du
                    gjøre i `}{" "}
                    <a href="/sosialhjelp/meldinger">meldingstjenesten.</a>
                </span>
            </MeldingsInnhold>
        </StyledSnakkeboble>
    );
};
export default MeldingstjenesteInfo;
