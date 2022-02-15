import "@testing-library/jest-dom";
import React from "react";
import {render, fireEvent, screen} from "../../../test/test-utils";
import {DokumentasjonEtterspurtAccordion} from "./DokumentasjonEtterspurtAccordion";
import {REST_STATUS} from "../../../utils/restUtils";

test("Rendrer DokumentasjonEtterspurt", async () => {
    render(
        <DokumentasjonEtterspurtAccordion
            dokumentasjonEtterspurt={[]}
            dokumentasjonEtterspurtErFraInnsyn={true}
            antallDagerSidenFristBlePassert={1}
            innsendelsesfrist={null}
            restStatus_oppgaver={REST_STATUS.OK}
        />
    );
    expect(screen.getByText("Du må levere opplysninger til søknaden din")).toBeVisible();
    fireEvent.click(screen.getByText("Du må levere opplysninger til søknaden din"));
    expect(
        screen.getByText("Vi trenger flere opplysninger om deg for å behandle søknaden din.", {exact: false})
    ).toBeVisible();
});
