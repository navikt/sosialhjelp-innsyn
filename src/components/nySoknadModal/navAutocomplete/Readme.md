#Autocomplete

Enkel autocomplete for små dataset. Støtte for ARIA attributer. 

Properties: 
 
 * suggestions: Eksempel [{key: "1", value: "Oslo"];
 * id: string;
 * placeholder?: string;
 * ariaLabel: string;
 * onSelect: (value: Suggestion) => void;
 * onReset?: Callback som trigges hvis bruker tømmer tekstfeltet;
 
Laget med inspirasjon fra `pam-portal/src/pages/home/searchbox/TypeaheadSuggestion.js`

