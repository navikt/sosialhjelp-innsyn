import React from "react";
import "./autcompleteSuggestion.less";
import {Suggestion} from "./NavAutcomplete";

interface AutcompleteSuggestionProps {
    index: number;
    id: string;
    suggestion: Suggestion|undefined;
    active: boolean;
    setSuggestionIndex: (index: number) => void;
    avoidBlur: () => void;
    onClick: (value: Suggestion|undefined) => void;
}

const AutcompleteSuggestion: React.FC<AutcompleteSuggestionProps> = (
    { index, id, suggestion, active, setSuggestionIndex, avoidBlur, onClick}) => {

    const onMouseMove = () => {
        setSuggestionIndex(index);
    };

    return (
        <li
            id={`${id}-item-${index}`}
            role="option"
            aria-selected={active}
            onClick={() => onClick(suggestion)}
            onMouseMove={() => onMouseMove()}
            onFocus={() => avoidBlur()}
            onMouseDown={() => avoidBlur()}
            onKeyDown={() => avoidBlur()}
            className="AutcompleteSuggestion typo-normal"
        >
            <span className={`AutcompleteSuggestion__inner ${active && 'AutcompleteSuggestion--active'}`}>
                {suggestion && suggestion.value}
            </span>
        </li>
    );
};

export default AutcompleteSuggestion;
