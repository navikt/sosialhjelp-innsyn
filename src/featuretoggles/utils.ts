import {IToggle} from "@unleash/nextjs";

import {browserEnv} from "../utils/env";

import {EXPECTED_TOGGLES} from "./toggles";

export function localDevelopmentToggles(): IToggle[] {
    return EXPECTED_TOGGLES.map(
        (it): IToggle => ({
            name: it,
            enabled: true,
            impressionData: false,
            variant: {
                name: "disabled",
                enabled: false,
            },
        })
    );
}

export function getUnleashEnvironment(): "development" | "production" {
    // hmm
    switch (process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT) {
        case "dev":
        case "dev-sbs":
        case "local":
        case "mock":
            return "development";
        case "prod":
            return "production";
    }
}
