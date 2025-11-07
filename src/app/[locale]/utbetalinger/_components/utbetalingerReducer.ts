import { Interval } from "date-fns";

import { Option } from "../_types/types";

type ActionType = "updateAndRender" | "setEgendefinert" | "updateInterval";

export type Action = { type: ActionType; payload?: { chip: Option; interval?: Interval } };

export type State =
    | {
          chip: Exclude<Option, "egendefinert">;
      }
    | {
          chip: "egendefinert";
          interval?: Interval;
      };

export type SelectedState = {
    selectedChip: Option;
    state: State;
};

export const reducer = (prevState: SelectedState, { type, payload }: Action): SelectedState => {
    if (type === "updateAndRender" && payload) {
        return {
            selectedChip: payload.chip,
            state: { chip: payload.chip },
        };
    }
    if (type === "setEgendefinert") {
        if (payload?.interval) {
            return {
                selectedChip: "egendefinert",
                state: {
                    chip: "egendefinert",
                    interval: payload.interval,
                },
            };
        }
        return {
            ...prevState,
            selectedChip: "egendefinert",
        };
    }
    if (type === "updateInterval" && payload?.interval) {
        return {
            ...prevState,
            state: {
                chip: "egendefinert",
                interval: payload.interval,
            },
        };
    }
    return prevState;
};

export const initialState: SelectedState = { state: { chip: "kommende" }, selectedChip: "kommende" };
