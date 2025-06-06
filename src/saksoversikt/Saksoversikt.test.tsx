import React from "react";
import { expect, describe, it } from "vitest";
import { delay, http, HttpResponse } from "msw";
import { waitForElementToBeRemoved, within } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import Saksoversikt from "../pages/[locale]";
import { server } from "../mocks/server";
import { render, screen } from "../test/test-utils";
import { SaksListeResponse } from "../generated/model";
import {
    getGetSaksDetaljerMockHandler,
    getGetSaksDetaljerResponseMock,
    getHentAlleSakerMockHandler,
} from "../generated/saks-oversikt-controller/saks-oversikt-controller.msw";

const notFound = http.get("*/api/v1/innsyn/saker", async () => {
    await delay(200);
    return new HttpResponse("Not found", { status: 404 });
});

const unauthorized = http.get("*/api/v1/innsyn/saker", async () => {
    await delay(200);
    return new HttpResponse("Unauthorized", { status: 401 });
});

const loading = http.get("*/api/v1/innsyn/saker", async () => {
    await delay("infinite");
    return new HttpResponse("Laster");
});

const success = getHentAlleSakerMockHandler([
    {
        kilde: "innsyn-api",
        soknadTittel: "Default søknad",
        url: faker.internet.url(),
        sistOppdatert: `${faker.date.past().toISOString().split(".")[0]}Z`,
        fiksDigisosId: faker.string.alphanumeric(5),
    } as SaksListeResponse,
]);

const utbetalingerDoesntExist = http.get("*/api/v1/innsyn/utbetalinger/exists", async () => {
    await delay(200);
    return HttpResponse.json(false);
});

const saksdetaljer = getGetSaksDetaljerMockHandler({
    ...getGetSaksDetaljerResponseMock(),
    status: "MOTTATT",
    soknadTittel: "Min kule søknad",
});

const empty = getHentAlleSakerMockHandler([]);

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
        expect(screen.getByText("Venter", { exact: false })).toBeInTheDocument();
    });

    it("Skal vise lasteindikator ved 401 unauthorized", async () => {
        server.use(unauthorized);
        render(<Saksoversikt />);
        expect(screen.getByText("Venter", { exact: false })).toBeInTheDocument();
    });

    it("Skal vise tom tilstand ved ingen saker", async () => {
        server.use(empty);
        render(<Saksoversikt />);
        await waitForElementToBeRemoved(() => screen.queryByText("Venter", { exact: false }));
        expect(screen.getAllByRole("heading")[1]).toHaveTextContent("Vi finner ingen søknader fra deg");
    });

    it("Skal vise innhold ved resultat", async () => {
        server.use(success, saksdetaljer, utbetalingerDoesntExist);
        render(<Saksoversikt />);
        const soknadSection = await screen.findByRole("region", { name: "Dine søknader" });
        expect(soknadSection).toBeVisible();
        const links = await within(soknadSection).findAllByRole("link", { name: /Min kule søknad/ });
        expect(links.length).toBeGreaterThan(0);
    });
});
