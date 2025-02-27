import { NyeOgTidligereUtbetalingerResponse } from "../../../generated/model";

import { FilterCriteria } from "./FilterContext";
import { filterMatch } from "./filterMatch";

export const filterResponses = (
    utbetalinger: NyeOgTidligereUtbetalingerResponse[] | undefined,
    filters: FilterCriteria | null
) =>
    !filters
        ? utbetalinger
        : utbetalinger?.map((response: NyeOgTidligereUtbetalingerResponse) => ({
              ...response,
              utbetalingerForManed: response.utbetalingerForManed.filter((utbetaling) =>
                  filterMatch(utbetaling, filters)
              ),
          }));
