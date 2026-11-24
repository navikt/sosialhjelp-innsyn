import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@test/test-utils";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../../../messages/nb.json";
import enMessages from "../../../../../../messages/en.json";
import nnMessages from "../../../../../../messages/nn.json";
import { server } from "../../../../../mocks/server";
import KlageInfo from "./KlageInfo";

vi.mock("next/navigation", () => ({ useParams: () => ({ id: "soknad-1" }) }));
vi.mock("@i18n/navigation", () => ({
    Link: (props: React.ComponentProps<"a">) => <a {...props} />,
}));

const url = "*/api/v1/innsyn/soknad-1/klage/tilgjengelig";

describe("KlageInfo", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    const innsendtKlage = {
        klageId: "klage-1",
        vedtakId: "vedtak-1",
        fiksDigisosId: "soknad-1",
        timestampSendt: Date.parse("2025-01-01T23:30:00Z"),
    };

    it("shows the submission deadline based on the date the appeal was sent, in Oslo time", () => {
        vi.spyOn(Date, "now").mockReturnValue(Date.parse("2025-04-02T21:59:59Z"));
        render(
            <NextIntlClientProvider locale="nb" messages={messages} timeZone="America/Los_Angeles">
                <KlageInfo vedtakId="vedtak-1" vedtaksdato="2024-12-01" innsendtKlage={innsendtKlage} />
            </NextIntlClientProvider>
        );

        expect(screen.getByRole("link", { name: "Se klagen og ettersend dokumentasjon" })).toHaveAttribute(
            "href",
            "/klage/status/soknad-1/klage-1"
        );
        expect(screen.getByText("02.04.2025").tagName).toBe("B");
        expect(screen.getByText("02.04.2025").parentElement).toHaveTextContent("Du kan sende inn frem til 02.04.2025");
    });

    it.each([
        ["nn", nnMessages, "Sjå klaga og ettersend dokumentasjon", "Du kan sende inn fram til"],
        ["en", enMessages, "View your appeal and submit documentation", "You can submit until"],
    ])("shows the submission deadline in %s", (locale, translations, linkText, deadlineText) => {
        vi.spyOn(Date, "now").mockReturnValue(Date.parse("2025-03-01T12:00:00Z"));
        render(
            <NextIntlClientProvider locale={locale} messages={translations} timeZone="Europe/Oslo">
                <KlageInfo vedtakId="vedtak-1" vedtaksdato="2024-12-01" innsendtKlage={innsendtKlage} />
            </NextIntlClientProvider>
        );

        expect(screen.getByRole("link", { name: linkText })).toHaveAttribute("href", "/klage/status/soknad-1/klage-1");
        const deadline = screen.getByText(deadlineText, { exact: false });
        expect(deadline.querySelector("b")).toHaveTextContent(/2025/);
    });

    it("shows the appeal link without a deadline after midnight in Oslo", () => {
        vi.spyOn(Date, "now").mockReturnValue(Date.parse("2025-04-02T22:00:00Z"));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato="2024-12-01" innsendtKlage={innsendtKlage} />);

        expect(screen.getByRole("link", { name: "Se klagen din" })).toHaveAttribute(
            "href",
            "/klage/status/soknad-1/klage-1"
        );
        expect(screen.queryByText("Fristen for å ettersende dokumentasjon har utløpt")).not.toBeInTheDocument();
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

            expect(screen.getByRole("link", { name: "Se klagen og ettersend dokumentasjon" })).toBeInTheDocument();
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

    it("Shows klagefrist as vedtaksdato + 4 weeks", async () => {
        vi.setSystemTime(new Date("2026-01-21T12:00:00Z"));
        server.use(http.get(url, () => HttpResponse.json({ kanSendeKlage: true })));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato={"2026-01-01"} />);
        const dato = await screen.findByText("29.01.2026");
        expect(dato.tagName).toBe("B");
        expect(dato.parentElement).toHaveTextContent("Du kan klage frem til 29.01.2026");
    });

    it.each([
        ["nb", messages, "Kontakt Nav-kontoret", "Les mer om dine klagerettigheter.", ""],
        ["nn", nnMessages, "Kontakt Nav-kontoret", "Les meir om klagerettane dine.", "/nn"],
        ["en", enMessages, "Contact your local Nav office", "Read more about your appeal rights.", "/en"],
    ])(
        "shows the expired deadline and localized links in %s",
        async (locale, translations, contact, rights, suffix) => {
            vi.setSystemTime(new Date("2026-01-29T23:00:00Z"));
            server.use(http.get(url, () => HttpResponse.json({ kanSendeKlage: true })));
            render(
                <NextIntlClientProvider locale={locale} messages={translations} timeZone="America/Los_Angeles">
                    <KlageInfo vedtakId="vedtak-1" vedtaksdato="2026-01-01" />
                </NextIntlClientProvider>
            );

            expect(await screen.findByRole("link", { name: contact })).toHaveAttribute(
                "href",
                `https://www.nav.no/finn-nav-kontor${suffix}`
            );
            expect(screen.getByRole("link", { name: rights })).toHaveAttribute(
                "href",
                `https://www.nav.no/klagerettigheter${suffix}`
            );
            expect(
                screen.queryByRole("link", { name: /Klag på vedtaket|Appeal the decision/ })
            ).not.toBeInTheDocument();
            if (locale === "nb") {
                expect(screen.getByText(/Klagefristen har utløpt/)).toHaveTextContent(
                    "Klagefristen har utløpt. Kontakt Nav-kontoret ditt dersom du ikke rakk å klage innen fristen, men fortsatt ønsker å klage på vedtaket. Les mer om dine klagerettigheter."
                );
            }
        }
    );

    it.each([
        ["winter", "2026-01-01", "2026-01-29T22:59:59.999Z"],
        ["summer time transition", "2025-03-10", "2025-04-07T21:59:59.999Z"],
    ])("keeps the deadline day open in Oslo during %s", async (_season, vedtaksdato, now) => {
        vi.setSystemTime(new Date(now));
        server.use(http.get(url, () => HttpResponse.json({ kanSendeKlage: true })));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato={vedtaksdato} />);

        expect(await screen.findByRole("link", { name: "Klag på vedtaket" })).toBeInTheDocument();
    });

    it("shows appeal information when digital appeals are unavailable and the deadline has passed", async () => {
        server.use(http.get(url, () => HttpResponse.json({ kanSendeKlage: false })));
        render(<KlageInfo vedtakId="vedtak-1" vedtaksdato="2020-01-01" />);

        expect(
            await screen.findByRole("link", { name: "Les mer om dine klagerettigheter og hvordan du klager" })
        ).toHaveAttribute("href", "https://www.nav.no/okonomisk-sosialhjelp#klage");
        expect(screen.queryByRole("link", { name: /klageskjema/ })).not.toBeInTheDocument();
        expect(screen.queryByText(/Klagefristen har utløpt/)).not.toBeInTheDocument();
    });
});
