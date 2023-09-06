import React from "react";
import Utbetalinger from "./beta/UtbetalingerBeta";
import {render, screen} from "../test/test-utils";
import {server} from "../mocks/server";
import {rest} from "msw";
import {getHentNyeUtbetalingerMock} from "../generated/utbetalinger-controller/utbetalinger-controller.msw";
import {getHentAlleSakerMock} from "../generated/saks-oversikt-controller/saks-oversikt-controller.msw";
import {fireEvent, waitFor} from "@testing-library/react";
import {subMonths} from "date-fns";
import {randomUUID} from "node:crypto";
import {NyeOgTidligereUtbetalingerResponse} from "../generated/model";

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
const loading = rest.get("*/api/v1/innsyn/nye", (_req, res, ctx) =>
    res(ctx.delay(1000), ctx.status(200, "Mocked status"), ctx.json(getHentNyeUtbetalingerMock()))
);

const utbetaling5ManederSiden = rest.get("*/api/v1/innsyn/tidligere", (_req, res, ctx) => {
    const utbetaling5ManederSiden = makeUtbetaling(subMonths(new Date(), 5));
    return res(ctx.status(200, "Mocked status"), ctx.json([utbetaling5ManederSiden]));
});

const utbetalingToday = rest.get("*/api/v1/innsyn/nye", (_req, res, ctx) => {
    const utbetalingToday = makeUtbetaling(new Date());
    return res(ctx.status(200, "Mocked status"), ctx.json([utbetalingToday]));
});

const harSoknaderMedInnsyn = rest.get("*/api/v1/innsyn/harSoknaderMedInnsyn", (_req, res, ctx) =>
    res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json(true))
);

const harIkkeSoknaderMedInnsyn = rest.get("*/api/v1/innsyn/harSoknaderMedInnsyn", (_req, res, ctx) =>
    res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json(false))
);

const alleSaker = rest.get("*/api/v1/innsyn/saker", (_req, res, ctx) =>
    res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json(getHentAlleSakerMock()))
);

const ingenSaker = rest.get("*/api/v1/innsyn/saker", (_req, res, ctx) =>
    res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json([]))
);

const error = rest.get("*/api/v1/innsyn/harSoknaderMedInnsyn", (_req, res, ctx) =>
    res(ctx.delay(200), ctx.status(500, "Mocked status"))
);

jest.mock("../utils/useIsMobile", () => {
    return jest.fn(() => ({
        isMobile: false,
    }));
});

beforeAll(() =>
    Object.defineProperty(window, "crypto", {
        value: {randomUUID: randomUUID},
    })
);

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

        expect(await screen.findByText(/tekniske problemer/)).toBeVisible();
    });
});
