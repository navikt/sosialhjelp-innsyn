import { AmplitudeFiltervalgEvent, logAmplitudeEventTyped } from "../../../utils/amplitude";

import { FilterKey, FilterPredicate } from "./FilterContext";

const getFilterUpdates = (action: FilterPredicate): AmplitudeFiltervalgEvent[] =>
    Object.keys(action)
        .filter((key) => action[key as FilterKey] !== undefined)
        .map((key) => ({
            eventName: "filtervalg",
            eventData: {
                kategori: key as FilterKey,
                filternavn: action[key as FilterKey],
            },
        }));

export const filterLogAnalytics = (action: FilterPredicate) =>
    getFilterUpdates(action).map((e) => logAmplitudeEventTyped(e));
