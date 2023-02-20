import "@testing-library/jest-dom";
import React from "react";
import {Vilkar} from "../../../redux/innsynsdata/innsynsdataReducer";
import {render, fireEvent, screen} from "../../../test/test-utils";
import {getUnikeVilkar, VilkarAccordion} from "./VilkarAccordion";

const vilkar: Vilkar[] = [
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel for et vilkår",
        beskrivelse: "beskrivelse",
        status: "behandlet",
    },
];

test("Rendrer vilkår", async () => {
    render(<VilkarAccordion vilkar={vilkar} />);

    expect(screen.getByText("Du har vilkår")).toBeVisible();

    fireEvent.click(screen.getByText("Du har vilkår"));

    expect(screen.getByText("tittel for et vilkår")).toBeVisible();
});

const flereVilkar: Vilkar[] = [
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel for et vilkår",
        beskrivelse: "beskrivelse",
        status: "behandlet",
    },
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel",
        beskrivelse: "beskrivelse",
        status: "behandlet",
    },
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel for et vilkår",
        beskrivelse: "beskrivelse",
        status: "behandlet",
    },
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel for et vilkår",
        beskrivelse: "trallala",
        status: "behandlet",
    },
];
test("Filtrér vilkår med lik tittel og beskrivelse", () => {
    const unikeVilkar = getUnikeVilkar(flereVilkar);

    expect(flereVilkar.length).toEqual(4);
    expect(unikeVilkar.length).toEqual(3);
});
