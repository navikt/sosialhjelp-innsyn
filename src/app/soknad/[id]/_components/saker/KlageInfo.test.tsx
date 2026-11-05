import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@test/test-utils";
import { server } from "../../../../../mocks/server";
import KlageInfo from "./KlageInfo";

vi.mock("next/navigation", () => ({ useParams: () => ({ id: "soknad-1" }) }));
vi.mock("@i18n/navigation", () => ({
    Link: (props: React.ComponentProps<"a">) => <a {...props} />,
}));

const url = "*/api/v1/innsyn/soknad-1/klage/tilgjengelig";
const queryInfoCard = () => screen.queryByRole("link", { name: "Klag på vedtaket" });

describe("KlageInfo", () => {
    it("shows the klage link when kanSendeKlage is true", async () => {
        server.use(http.get(url, () => HttpResponse.json({ kanSendeKlage: true })));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato={new Date().toISOString()} />);
        expect(await screen.findByRole("link", { name: "Klag på vedtaket" })).toHaveAttribute(
            "href",
            "/klage/opprett/soknad-1/vedtak-1"
        );
    });

    it("hides the klage link when kanSendeKlage is false", async () => {
        server.use(http.get(url, () => HttpResponse.json({ kanSendeKlage: false })));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato={new Date().toISOString()} />);
        expect(queryInfoCard()).not.toBeInTheDocument();
    });

    it("hides the klage link when the call fails", async () => {
        server.use(http.get(url, () => HttpResponse.json({ error: "x" }, { status: 500 })));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato={new Date().toISOString()} />);
        expect(queryInfoCard()).not.toBeInTheDocument();
    });

    it("Shows klagefrist as vedtaksdato + 3 weeks", async () => {
        server.use(http.get(url, () => HttpResponse.json({ kanSendeKlage: true })));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato={"2026-01-01"} />);
        expect(await screen.findByText("Du kan klage frem til 22.01.2026")).toBeInTheDocument();
    });
});
