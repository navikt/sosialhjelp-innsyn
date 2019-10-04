import React, {useRef, useState} from "react";
import EnkelModal from "./EnkelModal";
import {Element, EtikettLiten, Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import {Knapp} from "nav-frontend-knapper";

const NySoknadModal: React.FC<{synlig: boolean, onRequestClose: () => void }> = ({synlig, onRequestClose}) => {
    // const textInput = useRef();

    const [value, setValue] = useState("");

    const onKeyDown = (event: any) => {
        console.log("onKeyDown....");
        const { value } = event.target;
        setValue(value);
    };

    const onChange = (event: any) => {
        console.log("onChange....");
        const { value } = event.target;
        setValue(value);
    };

    const onBlur = (): void => {
      console.log("onBlur....");
    };

    const onFocus = (): void => {
        console.log("onFocus....");
    };

    return (
        <EnkelModal
            contentLabel="Content Label"
            onRequestClose={() => onRequestClose()}
            isOpen={synlig}
        >
            <Innholdstittel>Innholdstittel</Innholdstittel>
            <Normaltekst>Sjekk om du kan søke digitalt i din kommune</Normaltekst>

            <br/>

            <input
                // id={this.props.id}
                type="search"
                role="textbox"
                aria-label={"kommunesok"}
                aria-autocomplete="list"
                aria-controls={`kommunesok-suggestions`}
                // aria-activedescendant={activeDescendant}
                placeholder="Søk etter din kommune"
                value={value}
                autoComplete="off"
                onChange={(event: any) => onChange(event)}
                onBlur={() => onBlur()}
                onKeyDown={(event: any) => onKeyDown(event)}
                onFocus={() => onFocus()}
                // ref={(input) => { textInput = input; }}
                className="SearchBox__input typo-normal"
            />

            <br/>
            <br/>
            <Knapp
                type="hoved"
            >
                Søk digital
            </Knapp>

        </EnkelModal>
    );
};

export default NySoknadModal;
