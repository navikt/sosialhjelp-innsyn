import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@test/test-utils";
import { getHentHendelserBetaMockHandler } from "@generated/hendelse-controller/hendelse-controller.msw";
import { server } from "../../../../../../mocks/server";
import { formats } from "@i18n/request";

import History from "./History";

vi.mock("next/navigation", () => ({ useParams: () => ({ id: "soknad-1" }) }));

const renderHistory = () =>
    render(
        <NextIntlClientProvider locale="nb" formats={formats}>
            <Suspense fallback={null}>
                <h2 id="history-heading">Historikk</h2>
                <History labelledById="history-heading" />
            </Suspense>
        </NextIntlClientProvider>
    );

describe("History", () => {
    it("shows a sent appeal with its date in reverse chronological order", async () => {
        server.use(
            getHentHendelserBetaMockHandler([
                { type: "SoknadFerdigBehandlet", tidspunkt: "2025-11-15T10:00:00Z" },
                { type: "KlageSendt", tidspunkt: "2025-11-17T10:00:00Z" },
            ])
        );

        renderHistory();

        expect(await screen.findByText("Du klaget på et vedtak")).toBeInTheDocument();
        const events = screen.getAllByRole("listitem");
        expect(events).toHaveLength(2);
        expect(within(events[0]).getByText("Du klaget på et vedtak")).toBeInTheDocument();
        expect(within(events[0]).getByText(/17\. november 2025/)).toBeInTheDocument();
        expect(within(events[1]).getByText("Søknaden din er ferdig behandlet")).toBeInTheDocument();
    });

    it("reveals and focuses an older sent appeal when expanding the history", async () => {
        server.use(
            getHentHendelserBetaMockHandler([
                { type: "KlageSendt", tidspunkt: "2025-11-10T10:00:00Z" },
                ...Array.from({ length: 5 }, (_, index) => ({
                    type: "SoknadFerdigBehandlet" as const,
                    tidspunkt: `2025-11-${11 + index}T10:00:00Z`,
                })),
            ])
        );

        renderHistory();

        const showMore = await screen.findByRole("button", { name: "Vis flere steg (1)" });
        expect(screen.queryByText("Du klaget på et vedtak")).not.toBeInTheDocument();

        fireEvent.click(showMore);

        const appeal = screen.getByText("Du klaget på et vedtak").closest("li");
        expect(appeal).toBeVisible();
        await waitFor(() => expect(appeal).toHaveFocus());
    });

    it("hides a submission event without documents and keeps the genuine submission", async () => {
        server.use(
            getHentHendelserBetaMockHandler([
                { type: "LevertEtterspurtDokumentasjon", tidspunkt: "2025-11-10T10:00:00Z", antallDokumenter: 2 },
                { type: "LevertEtterspurtDokumentasjon", tidspunkt: "2025-11-12T10:00:00Z", antallDokumenter: 0 },
            ])
        );

        renderHistory();

        const submission = await screen.findByText("Du sendte inn dokumentasjon");
        expect(screen.getAllByText("Du sendte inn dokumentasjon")).toHaveLength(1);
        expect(screen.getAllByRole("listitem")).toHaveLength(1);
        expect(within(submission.closest("li")!).getByText(/10\. november 2025/)).toBeInTheDocument();
    });

    it("does not show the expand button when the hidden event is the only one beyond the limit", async () => {
        server.use(
            getHentHendelserBetaMockHandler([
                { type: "LevertEtterspurtDokumentasjon", tidspunkt: "2025-11-10T10:00:00Z", antallDokumenter: 1 },
                { type: "LevertEtterspurtDokumentasjon", tidspunkt: "2025-11-11T10:00:00Z", antallDokumenter: 0 },
                ...Array.from({ length: 4 }, (_, index) => ({
                    type: "SoknadFerdigBehandlet" as const,
                    tidspunkt: `2025-11-${12 + index}T10:00:00Z`,
                })),
            ])
        );

        renderHistory();

        expect(await screen.findByText("Du sendte inn dokumentasjon")).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(5);
        expect(screen.queryByRole("button", { name: /Vis flere steg/ })).not.toBeInTheDocument();
    });
});
