import "@testing-library/jest-dom";
import React from "react";
import {render, screen} from "../../../test/test-utils";
import DokumentasjonkravAccordion from "./DokumentasjonkravAccordion";

jest.mock("./DokumentasjonKravView", () => () => <div>Mocked View</div>);

test("Rendrer Dokumentasjonkrav", async () => {
    render(
        <DokumentasjonkravAccordion
            dokumentasjonkrav={[
                {
                    dokumentasjonkravElementer: [],
                    dokumentasjonkravId: "id",
                },
            ]}
        />
    );

    expect(screen.getByText("Du må levere opplysninger")).toBeVisible();
});
