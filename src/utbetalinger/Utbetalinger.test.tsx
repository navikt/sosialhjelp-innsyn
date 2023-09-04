import React from "react";

import Utbetalinger from "./Utbetalinger";
import {render, screen} from "../test/test-utils";
import {server} from "../mocks/server";
import {rest} from "msw";
import {getHentUtbetalingerMock} from "../generated/utbetalinger-controller/utbetalinger-controller.msw";
import {getHentAlleSakerMock} from "../generated/saks-oversikt-controller/saks-oversikt-controller.msw";
import {fireEvent, waitFor} from "@testing-library/react";
import {subMonths, format, subDays, startOfMonth} from "date-fns";
import {nb} from "date-fns/locale";

const makeUtbetaling = (date: Date) => {
    return {
        maned: format(date, "LLLL", {locale: nb}),
        ar: date.getFullYear(),
        foersteIManeden: startOfMonth(date).toISOString(),
        utbetalinger: [
            {
                utbetalingsdato: date.toString(),
                status: "utbetalt",
                fiksDigisosId: "123",
                tittel: "Penger",
                belop: 1000,
                annenMottaker: false,
            },
        ],
    };
};
const loading = rest.get("*/api/v1/innsyn/utbetalinger", (_req, res, ctx) =>
    res(ctx.delay(1000), ctx.status(200, "Mocked status"), ctx.json(getHentUtbetalingerMock()))
);

const utbetaling5ManederSiden = rest.get("*/api/v1/innsyn/utbetalinger", (_req, res, ctx) => {
    const utbetaling5ManederSiden = makeUtbetaling(subMonths(new Date(), 5));
    return res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json([utbetaling5ManederSiden]));
});

const utbetalingYesterday = rest.get("*/api/v1/innsyn/utbetalinger", (_req, res, ctx) => {
    const utbetalingYesterday = makeUtbetaling(subDays(new Date(), 1));
    return res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json([utbetalingYesterday]));
});

const harSoknaderMedInnsyn = rest.get("*/api/v1/innsyn/harSoknaderMedInnsyn", (_req, res, ctx) =>
    res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json(true))
);

// const harIkkeSoknaderMedInnsyn = rest.get("*/api/v1/innsyn/harSoknaderMedInnsyn", (_req, res, ctx) =>
//     res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json(false))
// );

const alleSaker = rest.get("*/api/v1/innsyn/saker", (_req, res, ctx) =>
    res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json(getHentAlleSakerMock()))
);

// const ingenSaker = rest.get("*/api/v1/innsyn/saker", (_req, res, ctx) =>
//     res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json([]))
// );

const error = rest.get("*/api/v1/innsyn/harSoknaderMedInnsyn", (_req, res, ctx) =>
    res(ctx.delay(200), ctx.status(500, "Mocked status"))
);

describe("Utbetalinger", () => {
    it("Viser lastestripe under innlasting", async () => {
        server.use(loading, alleSaker, harSoknaderMedInnsyn);

        render(<Utbetalinger />);

        const periodeVelger = await screen.findByRole("group", {name: "Velg periode"});
        expect(periodeVelger).toBeInTheDocument();
        expect(screen.getByRole("group", {name: "Velg mottaker"})).toBeInTheDocument();
        expect(screen.getByTestId("lastestriper")).toBeInTheDocument();
    });

    // it("Viser tom tilstand ved ingen saker", async () => {
    //     server.use(ingenSaker, harSoknaderMedInnsyn);
    //
    //     render(<Utbetalinger />);
    //
    //     const tomTilstand = await screen.findByRole("heading", {name: /Vi finner ingen/});
    //     expect(tomTilstand).toBeVisible();
    // });

    it("Viser 4 måneder gammel utbetaling hvis man huker av for 'siste 6 måneder'", async () => {
        server.use(utbetaling5ManederSiden, alleSaker, harSoknaderMedInnsyn);

        render(<Utbetalinger />);

        await waitFor(() => screen.queryByRole("group", {name: "Velg mottaker"}));
        expect(screen.queryByRole("heading", {name: "Penger"})).not.toBeInTheDocument();
        fireEvent.click(await screen.findByRole("radio", {name: "Siste 6 måneder"}));
        expect(await screen.findByRole("heading", {name: "Penger"})).toBeInTheDocument();
    });

    // it("Viser tom tilstand ved ingen søknader med innsyn", async () => {
    //     server.use(alleSaker, harIkkeSoknaderMedInnsyn);
    //
    //     render(<Utbetalinger />);
    //
    //     const tomTilstand = await screen.findByRole("heading", {name: /Vi kan ikke vise dine utbetalinger/});
    //     expect(tomTilstand).toBeVisible();
    // });

    it("Viser utbetalinger ved suksess", async () => {
        server.use(utbetalingYesterday, alleSaker, harSoknaderMedInnsyn);

        render(<Utbetalinger />);

        expect(await screen.findByRole("heading", {name: "Penger"})).toBeInTheDocument();
    });

    it("Viser ikke utbetaling hvis man fjerner 'til deg'", async () => {
        server.use(utbetalingYesterday, alleSaker, harSoknaderMedInnsyn);

        render(<Utbetalinger />);

        expect(await screen.findByRole("heading", {name: "Penger"})).toBeInTheDocument();
        fireEvent.click(screen.getByRole("checkbox", {name: "Til deg"}));
        expect(screen.queryByRole("heading", {name: "Penger"})).not.toBeInTheDocument();
    });

    it("Viser feil når man får >500 fra server", async () => {
        server.use(error);
        render(<Utbetalinger />);

        expect(await screen.findByText(/tekniske problemer/)).toBeVisible();
    });
});
