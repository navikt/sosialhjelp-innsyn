import React from "react";
import { expect, test, vi } from "vitest";
import { Accordion } from "@navikt/ds-react";

import { render, screen } from "../../../test/test-utils";

import DokumentasjonkravAccordion from "./DokumentasjonkravAccordion";

vi.mock("./DokumentasjonKravView", () => ({
    default: Object.assign(() => <div>Mocked View</div>, { displayName: "HeyHey" }),
}));

test("Rendrer Dokumentasjonkrav", async () => {
    render(
        <Accordion>
            <DokumentasjonkravAccordion
                dokumentasjonkrav={[
                    {
                        dokumentasjonkravElementer: [],
                        dokumentasjonkravId: "id",
                    },
                ]}
            />
        </Accordion>
    );

    expect(screen.getByText("Du må levere dokumentasjon")).toBeVisible();
});
