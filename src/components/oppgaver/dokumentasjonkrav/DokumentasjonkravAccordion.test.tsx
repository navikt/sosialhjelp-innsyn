import "@testing-library/jest-dom";
import React from "react";
import {render, screen} from "../../../test/test-utils";
import DokumentasjonkravAccordion from "./DokumentasjonkravAccordion";

test("Rendrer Dokumentasjonkrav", async () => {
    render(<DokumentasjonkravAccordion dokumentasjonkrav={[]} />);

    expect(screen.getByText("Du må levere opplysninger")).toBeVisible();
});
