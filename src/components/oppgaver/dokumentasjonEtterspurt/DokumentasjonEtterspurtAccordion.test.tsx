import "@testing-library/jest-dom";
import React from "react";
import {render, fireEvent, screen} from "../../../test/test-utils";
import {DokumentasjonEtterspurtAccordion} from "./DokumentasjonEtterspurtAccordion";
import {REST_STATUS} from "../../../utils/restUtils";
import {Route, Routes} from "react-router-dom";
import {HendelseTypeEnum} from "../../../utils/vedleggUtils";

test("Rendrer DokumentasjonEtterspurt", async () => {
    render(
        <Routes>
            <Route
                path="/:soknadId/status"
                element={
                    <DokumentasjonEtterspurtAccordion
                        dokumentasjonEtterspurt={[
                            {
                                innsendelsesfrist: undefined,
                                oppgaveId: "",
                                oppgaveElementer: [
                                    {
                                        dokumenttype: "",
                                        hendelsetype: HendelseTypeEnum.DOKUMENTASJON_ETTERSPURT,
                                        hendelsereferanse: "",
                                    },
                                ],
                            },
                        ]}
                        restStatus_oppgaver={REST_STATUS.OK}
                    />
                }
            />
        </Routes>,
        {route: "/test-id/status"}
    );
    expect(screen.getByText("Du må levere opplysninger til søknaden din")).toBeVisible();
    fireEvent.click(screen.getByText("Du må levere opplysninger til søknaden din"));
    expect(
        screen.getByText("Vi trenger flere opplysninger om deg for å behandle søknaden din.", {exact: false})
    ).toBeVisible();
});
