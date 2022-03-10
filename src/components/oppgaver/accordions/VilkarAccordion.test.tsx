import "@testing-library/jest-dom";
import React from "react";
import {Vilkar} from "../../../redux/innsynsdata/innsynsdataReducer";
import {fireEvent, render, screen} from "../../../test/test-utils";
import {VilkarAccordion} from "./VilkarAccordion";

const vilkar: Vilkar[] = [
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel for et vilkår",
        beskrivelse: "beskrivelse",
        status: "behandlet",
        utbetalingsReferanse: [],
    },
];

test("Rendrer vilkår", async () => {
    render(<VilkarAccordion vilkar={vilkar} />);

    expect(screen.getByText("Du har vilkår")).toBeVisible();

    fireEvent.click(screen.getByText("Du har vilkår"));

    expect(screen.getByText("tittel for et vilkår")).toBeVisible();
});
