import React from "react";
import Saksoversikt from "./Saksoversikt";
import {
    getHentAlleSakerMock,
    getHentSaksDetaljerMock,
} from "../generated/saks-oversikt-controller/saks-oversikt-controller.msw";
import {rest} from "msw";
import {server} from "../mocks/server";
import {render, screen} from "../test/test-utils";
import {findAllByRole, waitForElementToBeRemoved} from "@testing-library/react";

const notFound = rest.get("*/api/v1/innsyn/saker", (_req, res, ctx) => {
    return res(ctx.delay(200), ctx.status(404, "Unauthorized"));
});

const unauthorized = rest.get("*/api/v1/innsyn/saker", (_req, res, ctx) => {
    return res(ctx.delay(200), ctx.status(401, "Unauthorized"));
});

const loading = rest.get("*/api/v1/innsyn/saker", (_req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200, "Laster"));
});

const success = rest.get("*/api/v1/innsyn/saker", (_req, res, ctx) => {
    return res(
        ctx.status(200, "Mocked status"),
        ctx.json(getHentAlleSakerMock().map((sak) => ({...sak, kilde: "innsyn-api"})))
    );
});

const utbetalingerDoesntExist = rest.get("*/api/v1/innsyn/utbetalinger/exists", (_req, res, ctx) => {
    return res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json(false));
});

const saksdetaljer = rest.get("*/api/v1/innsyn/saksDetaljer", (_req, res, ctx) => {
    return res(
        ctx.delay(200),
        ctx.status(200, "Mocked status"),
        ctx.json({...getHentSaksDetaljerMock(), status: "Mottatt"})
    );
});

const empty = rest.get("*/api/v1/innsyn/saker", (_req, res, ctx) => {
    return res(ctx.delay(200), ctx.status(200, "Mocked status"), ctx.json([]));
});

describe("Saksoversikt", () => {
    it("Skal vise feil ved server-feil", async () => {
        server.use(notFound);
        render(<Saksoversikt />);
        await screen.findByText("Vi klarte ikke å hente inn all informasjonen på siden.");
        expect(screen.getByText("Vi klarte ikke å hente inn all informasjonen på siden.")).toBeVisible();
    });

    it("Skal vise lasteindikator under innlasting", async () => {
        server.use(loading);
        render(<Saksoversikt />);
        expect(screen.getByText("venter...")).toBeInTheDocument();
    });

    it("Skal vise lasteindikator ved 401 unauthorized", async () => {
        server.use(unauthorized);
        render(<Saksoversikt />);
        expect(screen.getByText("venter...")).toBeInTheDocument();
    });

    it("Skal vise tom tilstand ved ingen saker", async () => {
        server.use(empty);
        render(<Saksoversikt />);
        await waitForElementToBeRemoved(() => screen.queryByText("venter..."));
        expect(screen.getByRole("heading")).toHaveTextContent("Vi finner ingen søknader fra deg");
    });

    it("Skal vise innhold ved resultat", async () => {
        server.use(success, saksdetaljer, utbetalingerDoesntExist);
        render(<Saksoversikt />);
        const soknadSection = await screen.findByRole("region", {name: "Dine søknader"});
        expect(soknadSection).toBeVisible();
        const links = await findAllByRole(soknadSection, "link", {name: /oppdatert/}, {timeout: 1000});
        expect(links.length).toBeGreaterThan(0);
    });
});
