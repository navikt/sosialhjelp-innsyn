import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@test/test-utils";
import { server } from "../../../../../mocks/server";
import KlageInfo from "./KlageInfo";

vi.mock("next/navigation", () => ({ useParams: () => ({ id: "soknad-1" }) }));

const url = "*/api/v1/innsyn/soknad-1/klage/tilgjengelig";
const knapp = () => screen.queryByText("Klag på vedtaket");

describe("KlageInfo", () => {
    it("shows the klage link when kanSendeKlage is true", async () => {
        server.use(http.get(url, () => HttpResponse.json({ kanSendeKlage: true })));
        render(<KlageInfo vedtakId="vedtak-1" />);
        expect(await screen.findByText("Klag på vedtaket")).toBeInTheDocument();
    });

    it("hides the klage link when kanSendeKlage is false", async () => {
        server.use(http.get(url, () => HttpResponse.json({ kanSendeKlage: false })));
        render(<KlageInfo vedtakId="vedtak-1" />);
        await new Promise((r) => setTimeout(r, 100));
        expect(knapp()).not.toBeInTheDocument();
    });

    it("hides the klage link when the call fails", async () => {
        server.use(http.get(url, () => HttpResponse.json({ error: "x" }, { status: 500 })));
        render(<KlageInfo vedtakId="vedtak-1" />);
        await new Promise((r) => setTimeout(r, 100));
        expect(knapp()).not.toBeInTheDocument();
    });
});
