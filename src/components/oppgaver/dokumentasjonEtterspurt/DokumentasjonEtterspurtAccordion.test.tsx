import React from "react";
import mockRouter from "next-router-mock";
import { expect, test } from "vitest";

import { render, fireEvent, screen } from "../../../test/test-utils";
import { OppgaveElementHendelsetype } from "../../../generated/model";

import { DokumentasjonEtterspurtAccordion } from "./DokumentasjonEtterspurtAccordion";

test("Rendrer DokumentasjonEtterspurt", async () => {
    await mockRouter.push("/test-id/status");

    render(
        <DokumentasjonEtterspurtAccordion
            dokumentasjonEtterspurt={[
                {
                    innsendelsesfrist: undefined,
                    oppgaveId: "",
                    oppgaveElementer: [
                        {
                            erFraInnsyn: true,
                            dokumenttype: "",
                            hendelsetype: OppgaveElementHendelsetype.dokumentasjonEtterspurt,
                            hendelsereferanse: "",
                            id: "dummy",
                        },
                    ],
                },
            ]}
        />
    );
    expect(screen.getByText("Du må levere dokumentasjon til søknaden din")).toBeVisible();
    fireEvent.click(screen.getByText("Du må levere dokumentasjon til søknaden din"));
    expect(screen.getByText("Vi trenger dokumentasjon for å behandle søknaden din", { exact: false })).toBeVisible();
});
