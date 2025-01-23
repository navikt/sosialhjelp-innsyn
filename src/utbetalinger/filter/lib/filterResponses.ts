import { NyeOgTidligereUtbetalingerResponse } from "../../../generated/model";

import { FilterPredicate } from "./FilterContext";
import { filterMatch } from "./filterMatch";

export const filterResponses = (
    utbetalinger: NyeOgTidligereUtbetalingerResponse[] | undefined,
    filters: FilterPredicate | null
) =>
    !filters
        ? utbetalinger
        : utbetalinger?.map((response: NyeOgTidligereUtbetalingerResponse) => ({
              ...response,
              utbetalingerForManed: response.utbetalingerForManed.filter((utbetaling) =>
                  filterMatch(utbetaling, filters)
              ),
          }));
