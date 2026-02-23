import { IToggle } from "@unleash/nextjs";

import { EXPECTED_TOGGLES } from "./toggles";

export function localDevelopmentToggles(): IToggle[] {
    return EXPECTED_TOGGLES.map(
        (it): IToggle => ({
            name: it,
            enabled: it !== "sosialhjelp.innsyn.ny_upload" && it !== "sosialhjelp.innsyn.klage",
            impressionData: false,
            variant: {
                name: "disabled",
                enabled: false,
            },
        })
    );
}
