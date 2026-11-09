import { fireEvent, render, screen, waitFor } from "@test/test-utils";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import nb from "../../../../../../../messages/nb.json";
import nn from "../../../../../../../messages/nn.json";
import en from "../../../../../../../messages/en.json";
import KlageForm from "./KlageForm";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn(), push: vi.fn() }) }));
vi.mock("@navikt/next-logger", () => ({ logger: { warn: vi.fn(), error: vi.fn() } }));
vi.mock("@components/filopplasting/api/useDocumentState", () => ({
    useDocumentState: () => ({
        state: {},
        addUploads: vi.fn(),
        removeUpload: vi.fn(),
        allFilesUploaded: true,
        noFileErrors: true,
        hasFormErrors: false,
    }),
}));
vi.mock("@components/filopplasting/FileSelectNew", () => ({ default: () => null }));

describe("KlageForm tekstlengde", () => {
    it.each([
        {
            locale: "nb",
            messages: nb,
            label: "Hvorfor er du uenig i vedtaket?",
            remaining: "1800 tegn igjen",
            excess: "1 tegn for mye",
        },
        {
            locale: "nn",
            messages: nn,
            label: "Kvifor er du usamd i vedtaket?",
            remaining: "1800 teikn igjen",
            excess: "1 teikn for mykje",
        },
        {
            locale: "en",
            messages: en,
            label: "Why do you disagree with the decision?",
            remaining: "1800 characters left",
            excess: "1 over the character limit",
        },
    ])("viser gjenværende tegn på $locale", ({ locale, messages, label, remaining, excess }) => {
        render(
            <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Oslo">
                <KlageForm fiksDigisosId="soknad-1" vedtakId="vedtak-1" klageId="klage-1" vedtakMottatt="2025-01-01" />
            </NextIntlClientProvider>
        );

        const textarea = screen.getByRole("textbox", { name: label });
        fireEvent.change(textarea, { target: { value: "a".repeat(200) } });
        expect(screen.getByText(remaining)).toBeInTheDocument();
        fireEvent.change(textarea, { target: { value: "a".repeat(2001) } });
        expect(screen.getByText(excess)).toBeInTheDocument();
    });

    it("godtar 2000 tegn, men viser feil og hindrer videre navigering ved 2001 tegn", async () => {
        const { unmount } = render(
            <KlageForm fiksDigisosId="soknad-1" vedtakId="vedtak-1" klageId="klage-1" vedtakMottatt="2025-01-01" />
        );
        const textarea = screen.getByRole("textbox", { name: "Hvorfor er du uenig i vedtaket?" });
        fireEvent.change(textarea, { target: { value: "a".repeat(2001) } });
        fireEvent.click(screen.getByRole("button", { name: "Se oppsummering" }));
        expect(await screen.findByText("Du kan skrive inn maks 2000 tegn")).toBeInTheDocument();

        fireEvent.change(textarea, { target: { value: "a".repeat(2000) } });
        fireEvent.click(screen.getByRole("button", { name: "Se oppsummering" }));
        await waitFor(() =>
            expect(screen.queryByRole("textbox", { name: "Hvorfor er du uenig i vedtaket?" })).not.toBeInTheDocument()
        );
        unmount();
    });
});
