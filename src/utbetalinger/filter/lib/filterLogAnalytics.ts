import { AmplitudeFiltervalgEvent, logAmplitudeEventTyped } from "../../../utils/amplitude";

import { FilterKey, FilterCriteria } from "./FilterContext";

const getFilterUpdates = (action: FilterCriteria): AmplitudeFiltervalgEvent[] =>
    Object.keys(action)
        .filter((key) => action[key as FilterKey] !== undefined)
        .map((key) => ({
            eventName: "filtervalg",
            eventData: {
                kategori: key as FilterKey,
                filternavn: action[key as FilterKey],
            },
        }));

export const filterLogAnalytics = (action: FilterCriteria) =>
    getFilterUpdates(action).map((e) => logAmplitudeEventTyped(e));
