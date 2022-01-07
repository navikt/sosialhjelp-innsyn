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
`;

const Lukkeknapp = styled(Button).attrs({variant: "tertiary"})`
    position: absolute;
    top: 0;
    right: 0;
    margin: 0 0 8px 8px;
`;

const useLocalStorageState = (key: string, initialValue = "") => {
    const [value, setValue] = React.useState<string>(() => window.localStorage.getItem(key) || initialValue);

    React.useEffect(() => {
        window.localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue] as const;
};

interface Props {
    dialogStatus?: DialogStatus;
}
const MeldingstjenesteInfo = (props: Props) => {
    const fornavn = useSelector((state: InnsynAppState) => state.innsynsdata.fornavn);
    const [harLukketInfo, setHarLukketInfo] = useLocalStorageState("visMeldingstjenesteInfo", "false");

    // Ikke vis boks hvis det er lagret i localstorage
    if (harLukketInfo === "true") return null;

    if (!props.dialogStatus) return null;

    const skalSeBoks = props.dialogStatus.tilgangTilDialog && !props.dialogStatus.harSendtMelding;
    if (!skalSeBoks) {
        return null;
    }
    const lukkInfo = () => {
        setHarLukketInfo("true");
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
                    <a href="/sosialhjelp/meldinger">meldingstjensten.</a>
                </span>
            </MeldingsInnhold>
        </StyledSnakkeboble>
    );
};
export default MeldingstjenesteInfo;
