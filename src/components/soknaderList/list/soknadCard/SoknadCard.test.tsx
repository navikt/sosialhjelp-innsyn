import { describe, it, expect } from "vitest";

import { render, screen } from "@test/test-utils";
import SoknadCard from "@components/soknaderList/list/soknadCard/SoknadCard";
import { getGetSaksDetaljerResponseMock } from "@generated/saks-oversikt-controller/saks-oversikt-controller.msw";
import type { SaksListeResponse } from "@generated/model";

describe("SoknadCard", () => {
    describe("UNDER_BEHANDLING", () => {
        it("Flere vedtak på én sak", async () => {
            const testSoknad: SaksListeResponse[] = [
                {
                    soknadTittel: "Whatever",
                    isPapirSoknad: false,
                    sistOppdatert: new Date().toISOString(),
                    soknadOpprettet: new Date().toISOString(),
                    fiksDigisosId: "046f8777-9bdf-467a-9a06-26a315c6c397",
                    kommunenummer: "123",
                },
            ];
            const detaljer = getGetSaksDetaljerResponseMock({
                saker: [{ status: "FERDIGBEHANDLET", antallVedtak: 2 }],
                status: "FERDIGBEHANDLET",
            });
            render(<SoknadCard soknad={{ ...testSoknad[0], ...detaljer }}></SoknadCard>);

            expect(await screen.findByText("Nytt vedtak")).toBeVisible();
        });
    });
});
