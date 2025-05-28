import React from "react";
import { expect, test } from "vitest";

import { render, fireEvent, screen } from "../../../test/test-utils";
import { VilkarResponse } from "../../../generated/model";

import { getUnikeVilkar, VilkarAccordion } from "./VilkarAccordion";

const vilkar: VilkarResponse[] = [
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel for et vilkår",
        beskrivelse: "beskrivelse",
        status: "OPPFYLT",
    },
];

test("Rendrer vilkår", async () => {
    render(<VilkarAccordion vilkar={vilkar} />);

    expect(screen.getByText("Du har vilkår")).toBeVisible();

    fireEvent.click(screen.getByText("Du har vilkår"));

    expect(screen.getByText("tittel for et vilkår")).toBeVisible();
});

const flereVilkar: VilkarResponse[] = [
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel for et vilkår",
        beskrivelse: "beskrivelse",
        status: "OPPFYLT",
    },
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel",
        beskrivelse: "beskrivelse",
        status: "OPPFYLT",
    },
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel for et vilkår",
        beskrivelse: "beskrivelse",
        status: "OPPFYLT",
    },
    {
        hendelsetidspunkt: "endato",
        vilkarReferanse: "referanse",
        tittel: "tittel for et vilkår",
        beskrivelse: "trallala",
        status: "OPPFYLT",
    },
];
test("Filtrér vilkår med lik tittel og beskrivelse", () => {
    const unikeVilkar = getUnikeVilkar(flereVilkar);

    expect(flereVilkar.length).toEqual(4);
    expect(unikeVilkar.length).toEqual(3);
});
