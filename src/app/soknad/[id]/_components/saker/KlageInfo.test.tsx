import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@test/test-utils";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../../../messages/nb.json";
import { server } from "../../../../../mocks/server";
import KlageInfo from "./KlageInfo";

vi.mock("next/navigation", () => ({ useParams: () => ({ id: "soknad-1" }) }));
vi.mock("@i18n/navigation", () => ({
    Link: (props: React.ComponentProps<"a">) => <a {...props} />,
}));

const url = "*/api/v1/innsyn/soknad-1/klage/tilgjengelig";

describe("KlageInfo", () => {
    afterEach(() => vi.restoreAllMocks());

    const innsendtKlage = {
        klageId: "klage-1",
        vedtakId: "vedtak-1",
        fiksDigisosId: "soknad-1",
        timestampSendt: Date.parse("2025-01-01T23:30:00Z"),
    };

    it("shows the submission deadline based on the date the appeal was sent, in Oslo time", () => {
        vi.spyOn(Date, "now").mockReturnValue(Date.parse("2025-01-22T22:59:59Z"));
        render(
            <NextIntlClientProvider locale="nb" messages={messages} timeZone="America/Los_Angeles">
                <KlageInfo vedtakId="vedtak-1" vedtaksdato="2024-12-01" innsendtKlage={innsendtKlage} />
            </NextIntlClientProvider>
        );

        expect(screen.getByRole("link", { name: "Ettersend dokumentasjon til klagen" })).toHaveAttribute(
            "href",
            "/klage/status/soknad-1/klage-1"
        );
        expect(screen.getByText("Du kan sende inn frem til 23.01.2025")).toBeInTheDocument();
    });

    it("shows the appeal link and expired deadline after midnight in Oslo", () => {
        vi.spyOn(Date, "now").mockReturnValue(Date.parse("2025-01-23T23:00:00Z"));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato="2024-12-01" innsendtKlage={innsendtKlage} />);

        expect(screen.getByRole("link", { name: "Se klagen din" })).toHaveAttribute(
            "href",
            "/klage/status/soknad-1/klage-1"
        );
        expect(screen.getByText("Fristen for å ettersende dokumentasjon har utløpt")).toBeInTheDocument();
        expect(screen.queryByText(/Du kan sende inn frem til/)).not.toBeInTheDocument();
    });

    it.each([null, undefined])(
        "shows the submission link without a date when timestampSendt is %s",
        (timestampSendt) => {
            render(
                <KlageInfo
                    vedtakId="vedtak-1"
                    vedtaksdato="2024-12-01"
                    innsendtKlage={{ ...innsendtKlage, timestampSendt }}
                />
            );

            expect(screen.getByRole("link", { name: "Ettersend dokumentasjon til klagen" })).toBeInTheDocument();
            expect(screen.queryByText(/Du kan sende inn frem til/)).not.toBeInTheDocument();
            expect(screen.queryByText("Fristen for å ettersende dokumentasjon har utløpt")).not.toBeInTheDocument();
        }
    );

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
        await expect(screen.findByRole("link", { name: "Klag på vedtaket" }, { timeout: 100 })).rejects.toThrow();
    });

    it("hides the klage link when the call fails", async () => {
        server.use(http.get(url, () => HttpResponse.json({ error: "x" }, { status: 500 })));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato={new Date().toISOString()} />);
        await expect(screen.findByRole("link", { name: "Klag på vedtaket" }, { timeout: 100 })).rejects.toThrow();
    });

    it("Shows klagefrist as vedtaksdato + 3 weeks", async () => {
        server.use(http.get(url, () => HttpResponse.json({ kanSendeKlage: true })));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato={"2026-01-01"} />);
        expect(await screen.findByText("Du kan klage frem til 22.01.2026")).toBeInTheDocument();
    });
});
