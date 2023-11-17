import React from "react";
import Utbetalinger from "../pages/utbetaling";
import {render, screen} from "../test/test-utils";
import {server} from "../mocks/server";
import {delay, http} from "msw";
import {getHentNyeUtbetalingerMock} from "../generated/utbetalinger-controller/utbetalinger-controller.msw";
import {getHentAlleSakerMock} from "../generated/saks-oversikt-controller/saks-oversikt-controller.msw";
import {fireEvent, waitFor} from "@testing-library/react";
import {subMonths} from "date-fns";
import {NyeOgTidligereUtbetalingerResponse} from "../generated/model";
import {HttpHandler, HttpResponse} from "msw";

const makeUtbetaling = (date: Date): NyeOgTidligereUtbetalingerResponse => {
    return {
        maned: date.getMonth() + 1,
        ar: date.getFullYear(),
        utbetalingerForManed: [
            {
                utbetalingsdato: date.toString(),
                status: "UTBETALT",
                fiksDigisosId: "123",
                tittel: "Penger til husleie",
                belop: 1000,
                annenMottaker: false,
            },
        ],
    };
};
const loading = http.get("*/api/v1/innsyn/nye", async (info) => {
    await delay("infinite");
    return HttpResponse.json(getHentNyeUtbetalingerMock());
});

const utbetaling5ManederSiden = http.get("*/api/v1/innsyn/tidligere", async () => {
    const utbetaling5ManederSiden = makeUtbetaling(subMonths(new Date(), 5));
    return HttpResponse.json([utbetaling5ManederSiden]);
});

const utbetalingToday = http.get("*/api/v1/innsyn/nye", (info) => {
    return HttpResponse.json([makeUtbetaling(new Date())]);
});

const harSoknaderMedInnsyn = http.get("*/api/v1/innsyn/harSoknaderMedInnsyn", async () => {
    await delay();
    return HttpResponse.json(true);
});

const harIkkeSoknaderMedInnsyn = http.get("*/api/v1/innsyn/harSoknaderMedInnsyn", async () => {
    await delay(100);
    return HttpResponse.json(false);
});

const alleSaker = http.get("*/api/v1/innsyn/saker", async () => {
    await delay(100);
    return HttpResponse.json(getHentAlleSakerMock());
});

const ingenSaker = http.get("*/api/v1/innsyn/saker", async () => {
    await delay();
    return HttpResponse.json([]);
});

const error = http.get("*/api/v1/innsyn/harSoknaderMedInnsyn", () => HttpResponse.error());

jest.mock("../utils/useIsMobile", () => {
    return jest.fn(() => false);
});

describe("Utbetalinger", () => {
    it("Viser utbetalinger ved suksess", async () => {
        server.use(utbetalingToday, alleSaker, harSoknaderMedInnsyn);

        render(<Utbetalinger />);

        await waitFor(async () => {
            const utbetaling = screen.getByText("Penger til husleie");
            expect(utbetaling).toBeInTheDocument();
        });
    });

    it("Viser lastestripe under innlasting", async () => {
        server.use(loading, alleSaker, harSoknaderMedInnsyn);

        render(<Utbetalinger />);

        const periodeVelger = await screen.findByRole("group", {name: "Velg periode"});
        expect(periodeVelger).toBeInTheDocument();
        expect(screen.getByRole("group", {name: "Velg mottaker"})).toBeInTheDocument();
        expect(screen.getByTestId("lastestriper")).toBeInTheDocument();
    });

    it("Viser tom tilstand ved ingen saker", async () => {
        server.use(ingenSaker, harSoknaderMedInnsyn);

        render(<Utbetalinger />);

        const tomTilstand = await screen.findByRole("heading", {name: /Vi finner ingen/});
        expect(tomTilstand).toBeVisible();
    });

    it("Viser 4 måneder gammel utbetaling hvis man huker av for 'tidligere utbetalinger'", async () => {
        server.use(utbetalingToday, utbetaling5ManederSiden, alleSaker, harSoknaderMedInnsyn);

        render(<Utbetalinger />);

        await waitFor(() => expect(screen.queryByText("Penger til husleie")).not.toBeInTheDocument());
        fireEvent.click(await screen.findByRole("tab", {name: "Tidligere utbetalinger"}));

        await waitFor(async () => {
            const utbetaling = screen.getByText("Penger til husleie");
            expect(utbetaling).toBeInTheDocument();
        });
    });

    it("Viser tom tilstand ved ingen søknader med innsyn", async () => {
        server.use(alleSaker, harIkkeSoknaderMedInnsyn);

        render(<Utbetalinger />);
        expect(await screen.findByRole("heading", {name: "Vi finner ingen søknader fra deg"})).toBeInTheDocument();
    });

    it("Viser ikke utbetaling hvis man velger 'til andre mottakere'", async () => {
        server.use(utbetalingToday, alleSaker, harSoknaderMedInnsyn);

        render(<Utbetalinger />);
        await waitFor(async () => {
            const utbetaling = screen.getByText("Penger til husleie");
            expect(utbetaling).toBeInTheDocument();
        });

        const radio = await screen.getByRole("radio", {name: "Til andre mottakere"});
        fireEvent.click(radio);
        await waitFor(async () => {
            const utbetaling = screen.queryByText("Penger til husleie");
            expect(utbetaling).not.toBeInTheDocument();
        });
    });

    it("Viser feil når man får >500 fra server", async () => {
        server.use(error);
        render(<Utbetalinger />);
        expect(
            await screen.findByRole("heading", {name: "Beklager, vi har dessverre tekniske problemer."})
        ).toBeInTheDocument();
    });
});
