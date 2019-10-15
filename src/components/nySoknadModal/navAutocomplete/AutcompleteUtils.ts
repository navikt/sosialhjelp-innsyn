import {Suggestion} from "./NavAutcomplete";

const filterSuggestions = (alleKommuner: Suggestion[], sokestreng: string): Suggestion[] => {
    return alleKommuner.filter((suggestion: Suggestion) => {
        return sokestreng && sokestreng.length > 0 && (
            suggestion.value.match(new RegExp("[ ]*" + sokestreng + ".*", "i"))
            || suggestion.value.match(new RegExp("[ ]*" + sokestreng + " .*", "i"))
        );
    });
};

const matchesStartOfWord = (streng: string, sokestreng: string): boolean => {
    return new RegExp("^" + sokestreng + " .*", "i").test(streng);
};

const matchesStartOfString = (testString: string, querystring: string): boolean => {
    return new RegExp("^" + querystring + ".*", "i").test(testString);
};

const matchesAnywhere = (testString: string, querystring: string): boolean => {
    let regexpMatch = new RegExp("[ ]*" + querystring + ".*", "i").test(testString)
        || new RegExp("[ ]*" + querystring + " .*", "i").test(testString);
    return regexpMatch;
};

const rankSearcResult = (testString: string, queryString: string): number => {
    if (queryString == null || queryString.length === 0) {
        return 0;
    } else if (matchesStartOfWord(testString, queryString)) {
        return 3;
    } else if (matchesStartOfString(testString, queryString)) {
        return 2;
    } else if (matchesAnywhere(testString, queryString)) {
        return 1;
    } else {
        return 0;
    }
};

const sorterSuggestions = (suggestions: Suggestion[], querystring: string): Suggestion[] => {
    return suggestions.sort((a, b) => {
        const rankA = rankSearcResult(a.value, querystring);
        const rankB = rankSearcResult(b.value, querystring);
        if (rankA > rankB) {
            return -1;
        }
        if (rankA < rankB) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        if (a.value > b.value) {
            return 1;
        }
        return 0;
    });
};

const searchSuggestions = (allSuggestions: Suggestion[], queryString: string|undefined): Suggestion[] => {
    if (queryString === undefined) {
        return [];
    }
    const filteredSuggestions: Suggestion[] = filterSuggestions(allSuggestions, queryString);
    return sorterSuggestions(filteredSuggestions, queryString).slice(0, 7);
};

export {searchSuggestions}
