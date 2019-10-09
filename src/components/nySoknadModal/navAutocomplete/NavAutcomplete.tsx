import React, {useState} from "react";
import "./navAutcomplete.less";
import AutcompleteSuggestion from "./AutcompleteSuggestion";
import {searchSuggestions} from "./AutcompleteUtils";

export interface NavAutocompleteProps {
    placeholder?: string;
    suggestions: Suggestion[];
    id: string;
    ariaLabel: string;
    onSelect: (value: Suggestion) => void;
}

export interface Suggestion {
    key: string;
    value: string;
}

enum KEY {
    TAB = 9,
    ENTER = 13,
    ESC = 27,
    ARROW_UP = 38,
    ARROW_DOWN = 40
}

const NavAutocomplete: React.FC<NavAutocompleteProps> = ({placeholder, suggestions, ariaLabel, id, onSelect} ) => {
    // const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion|undefined>();
    const [value, setValue] = useState<string>("");
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [blurDelay, setBlurDelay] = useState<any|undefined>(null);
    const [shouldBlur, setShouldBlur] = useState<boolean|undefined>(true);
    const [hasFocus, setHasFocus] = useState<boolean|undefined>(false);
    const [ariaActiveDescendant, setAriaActiveDescendant] = useState<boolean|undefined>(false);
    const [shouldShowSuggestions, setShouldShowSuggestions] = useState<boolean|undefined>(true);

    /**
     * Behandler tastaturnavigasjon i forslagslisten.
     * @param event
     */
    const onKeyDown = (event: React.KeyboardEvent) => {
        const hasSelectedSuggestion = activeSuggestionIndex > -1;
        setAriaActiveDescendant(event.keyCode === KEY.ARROW_UP || event.keyCode === KEY.ARROW_DOWN);
        switch (event.keyCode) {
            case KEY.TAB:
                if (hasSelectedSuggestion && shouldShowSuggestions) {
                    setValue(suggestions[activeSuggestionIndex].value);
                }
                break; // TODO Fjerne alle linjer med break; undøvendige...
            case KEY.ENTER:
                if (hasSelectedSuggestion && shouldShowSuggestions) {
                    event.preventDefault(); // Unngå form submit når bruker velger et av forslagene
                    setValue(suggestions[activeSuggestionIndex].value);
                    // setCurrentSuggestion(suggestions[activeSuggestionIndex]);
                    onClick(suggestions[activeSuggestionIndex]);

                } else {
                    setShouldShowSuggestions(false);
                }
                break;
            case KEY.ESC:
                // Hvis man trykker Esc, og forslagslisten er synlig, så skal listen skjules.
                // Hvis forslagslisten allerede er skjult, så vil verdien i
                // inputfeltet slettes (hvis dette er standard oppførsel i browseren).
                if (shouldShowSuggestions && suggestions.length > 0) {
                    setShouldShowSuggestions(false);
                    event.preventDefault(); // Unngå at verdi i inputfelt slettes
                }
                break;
            case KEY.ARROW_UP:
                if (shouldShowSuggestions) {
                    event.preventDefault();
                    // Marker forrige suggestion i listen.
                    // Hvis man er på toppen av listen og trykker pil opp, så skal ingen forslag markeres.
                    const oppdatertActiveSuggestionIndex = activeSuggestionIndex - 1 === -2 ? -1 : activeSuggestionIndex - 1;
                    setActiveSuggestionIndex(oppdatertActiveSuggestionIndex);
                }
                break;
            case KEY.ARROW_DOWN:
                if (shouldShowSuggestions) {
                    event.preventDefault();
                    // Marker neste suggestion i listen, så fremst man ikke er på slutten av listen
                    const oppdatertActiveSuggestionIndex = activeSuggestionIndex + 1 === suggestions.length
                        ? suggestions.length - 1
                        : activeSuggestionIndex + 1;
                    setActiveSuggestionIndex(oppdatertActiveSuggestionIndex);
                }
                break;
            default:
                break;
        }

    };

    /**
     * Vil skje hver gang man legger til eller fjerner en bokstav fra inputfeltet
     */
    const onChange = (event: any) => {
        const { value } = event.target;
        setValue(value);
        setShouldShowSuggestions(true);

        const filteredSuggestions: Suggestion[] = searchSuggestions(suggestions, value);
        const activeFilteredSuggestion = filteredSuggestions.filter((item: Suggestion) => {
            if (item.key === (suggestions[activeSuggestionIndex] && suggestions[activeSuggestionIndex].key)) {
                return item;
            } else {
                return false;
            }
        });
        if (activeFilteredSuggestion.length === 0) {
            setActiveSuggestionIndex(-1);
        }
    };

    const setSuggestionIndex = (index: number): void => {
        setActiveSuggestionIndex(index);
        clearBlurDelay();
    };

    const avoidBlur = (): void => {
        setShouldBlur(false);
    };

    const clearBlurDelay = (): void  =>{
        if (blurDelay) {
            clearTimeout(blurDelay);
            setBlurDelay(null);
        }
        setShouldBlur(true);
    };

    const onBlur = (): void => {
        const currentBlurDelay = setTimeout(() => {
            if (shouldBlur) {
                setHasFocus(false);
            }
        }, 10);
        setBlurDelay(currentBlurDelay);
    };

    const onFocus = (): void => {
        setHasFocus(true);
        setActiveSuggestionIndex(-1);
    };

    /**
     * Setter valgt forslag, og skjuler forslagslisten.
     * @param suggestionValue
     */
    const onClick = (suggestion: Suggestion|undefined): void => {
        if (suggestion) {
            setValue(suggestion.value);
            setShouldShowSuggestions(false);
            setActiveSuggestionIndex(-1);
            clearBlurDelay();
            onSelect(suggestion);
        }
    };

    const displaySuggestions: Suggestion[] = searchSuggestions(suggestions, value);

    const showSuggestions = hasFocus === true
        && shouldShowSuggestions
        && displaySuggestions.length > 0;

    const activeDescendant = ariaActiveDescendant && activeSuggestionIndex > -1
        ? `${id}-item-${activeSuggestionIndex}` : undefined;

    return (
        <div
            className="navAutocomplete"
            aria-owns={`${id}-suggestions`}
            aria-haspopup="listbox"
        >
            <input
                id={id}
                className="typo-normal"
                type="search"
                aria-label={ariaLabel}
                aria-autocomplete="list"
                aria-controls={`${id}-suggestions`}
                role="combobox"
                aria-expanded={showSuggestions}
                aria-activedescendant={activeDescendant}
                placeholder={placeholder ? placeholder : ""}
                value={value}
                autoComplete="off"
                onChange={(event: any) => onChange(event)}
                onBlur={() => onBlur()}
                onKeyDown={(event: any) => onKeyDown(event)}
                onFocus={() => onFocus()}
            />
            <ul
                id={`${id}-suggestions`}
                role="listbox"
                className={showSuggestions ? 'navAutocomplete__suggestions' : 'navAutocomplete__suggestions--hidden'}
            >
                {showSuggestions && displaySuggestions.map((suggestion: Suggestion, index: number) => (
                    <AutcompleteSuggestion
                        key={index}
                        id={id}
                        index={index}
                        suggestion={suggestion}
                        setSuggestionIndex={(index: number) => setSuggestionIndex(index)}
                        active={(index === activeSuggestionIndex) ? true : false}
                        avoidBlur={() => avoidBlur()}
                        onClick={(value: Suggestion|undefined) => onClick(value)}
                    />
                ) )}
            </ul>
        </div>
    );
};

export default NavAutocomplete;
