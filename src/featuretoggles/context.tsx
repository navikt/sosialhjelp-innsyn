import { IToggle } from "@unleash/nextjs";
import React, { createContext, PropsWithChildren, useContext, useEffect } from "react";

import { ExpectedToggles } from "./toggles";

const FlagContext = createContext<{ toggles: IToggle[] }>({ toggles: [] });

export function FlagProvider({ toggles, children }: PropsWithChildren<{ toggles: IToggle[] }>): React.JSX.Element {
    useEffect(() => {
        if (toggles == null) {
            // TODO: Disabler denne foreløpig, siden den logger for hvert sidebesøk når unleash ikke fungerer
            // logger.error("Toggles are not SSR'd, falling back to default toggles.");
        }
    }, [toggles]);

    return <FlagContext.Provider value={{ toggles: toggles ?? [] }}>{children}</FlagContext.Provider>;
}

export function useFlag(name: ExpectedToggles): IToggle {
    const context = useContext(FlagContext);
    const toggle = context.toggles.find((toggle) => toggle.name === name);

    if (toggle == null) {
        return { name, enabled: false, impressionData: false, variant: { name: "disabled", enabled: false } };
    }

    return toggle;
}
