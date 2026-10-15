import { render, screen, waitFor } from "@test/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ExpandableList from "@components/showmore/ExpandableList";
import SakBlokk from "./SakBlokk";
import VedtakPanel from "./VedtakPanel";

vi.mock("next/navigation", () => ({ useParams: () => ({ id: "soknad-1" }) }));
vi.mock("@featuretoggles/context", () => ({ useFlag: () => ({ enabled: false }) }));

const vedtak = [
    { id: "newest", vedtaksFilUrl: "https://example.test/newest", dato: "2026-03-03", utfall: "INNVILGET" as const },
    { id: "older", vedtaksFilUrl: "https://example.test/older", dato: "2026-02-02", utfall: "AVSLATT" as const },
];

describe("VedtakPanel", () => {
    it("shows the payout link only for granted decisions", () => {
        const { unmount } = render(<VedtakPanel vedtak={vedtak[0]} />);

        expect(screen.getByText("Se informasjon om utbetalingen")).toBeInTheDocument();
        unmount();

        render(<VedtakPanel vedtak={vedtak[1]} />);

        expect(screen.queryByText("Se informasjon om utbetalingen")).not.toBeInTheDocument();
    });

    it("shows one vedtak at first and expands the ordered list", async () => {
        const user = userEvent.setup();

        render(
            <>
                <h2 id="vedtak-heading">Vedtak</h2>
                <ExpandableList
                    as="ol"
                    items={vedtak}
                    itemsLimit={1}
                    id="vedtak-liste"
                    labelledById="vedtak-heading"
                    showMoreSuffix="vedtak"
                >
                    {(item, ref) => (
                        <li key={item.id} ref={ref} tabIndex={-1}>
                            <VedtakPanel vedtak={item} />
                        </li>
                    )}
                </ExpandableList>
            </>
        );

        expect(screen.getByRole("list")).toHaveProperty("tagName", "OL");
        expect(screen.getAllByRole("listitem")).toHaveLength(1);

        await user.click(screen.getByRole("button", { name: "Vis flere vedtak (1)" }));

        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        expect(screen.getByRole("heading", { name: "Vedtak 02.02.2026" })).toBeInTheDocument();
        await waitFor(() => expect(screen.getAllByRole("listitem")[1]).toHaveFocus());
    });

    it("shows an info card instead of a vedtak panel when a sak is under treatment", () => {
        render(
            <SakBlokk
                index={0}
                sak={{
                    tittel: "Strøm",
                    referanse: "sak-1",
                    status: "UNDER_BEHANDLING",
                    vedtak: [],
                    skalViseVedtakInfoPanel: false,
                }}
            />
        );

        expect(screen.getByRole("heading", { name: "Strøm" })).toBeInTheDocument();
        expect(
            screen.getByText(
                "Denne saken er under behandling. Når saken er ferdigbehandlet og du har fått et vedtak, vil det vises her."
            )
        ).toBeInTheDocument();
        expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("shows an under-treatment card when a case has no status", () => {
        render(
            <SakBlokk
                index={0}
                sak={{
                    tittel: "Strøm",
                    referanse: "sak-1",
                    vedtak: [],
                    skalViseVedtakInfoPanel: false,
                }}
            />
        );

        expect(
            screen.getByText(
                "Denne saken er under behandling. Når saken er ferdigbehandlet og du har fått et vedtak, vil det vises her."
            )
        ).toBeInTheDocument();
    });

    it.each([
        ["IKKE_INNSYN", "Saken din vil bli behandlet, men vi kan ikke vise status for søknaden din på nav.no."],
        [
            "BEHANDLES_IKKE",
            "Vi kan ikke vise status for søknaden din på nav.no. Det kan være fordi søknaden din blir behandlet sammen med en annen søknad du har sendt, eller fordi du har trukket tilbake søknaden.",
        ],
    ] as const)("shows the correct warning when status is %s", (status, description) => {
        render(
            <SakBlokk
                index={0}
                sak={{
                    tittel: "Strøm",
                    referanse: "sak-1",
                    status,
                    vedtak: [],
                    skalViseVedtakInfoPanel: false,
                }}
            />
        );

        expect(screen.getByText(description)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "ta kontakt med Nav-kontoret ditt" })).toHaveAttribute(
            "href",
            "https://www.nav.no/sok-nav-kontor"
        );
        expect(
            screen.queryByText(
                "Denne saken er under behandling. Når saken er ferdigbehandlet og du har fått et vedtak, vil det vises her."
            )
        ).not.toBeInTheDocument();
    });

    it("shows no status card for a case that is finished without a decision", () => {
        render(
            <SakBlokk
                index={0}
                sak={{
                    tittel: "Strøm",
                    referanse: "sak-1",
                    status: "FERDIGBEHANDLET",
                    vedtak: [],
                    skalViseVedtakInfoPanel: false,
                }}
            />
        );

        expect(screen.getByRole("heading", { name: "Strøm" })).toBeInTheDocument();
        expect(
            screen.queryByText(
                "Denne saken er under behandling. Når saken er ferdigbehandlet og du har fått et vedtak, vil det vises her."
            )
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText("Saken din vil bli behandlet, men vi kan ikke vise status for søknaden din på nav.no.")
        ).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "ta kontakt med Nav-kontoret ditt" })).not.toBeInTheDocument();
    });

    it("does not show under-treatment guidance alongside decisions", () => {
        render(
            <SakBlokk
                index={0}
                sak={{
                    tittel: "Strøm",
                    referanse: "sak-1",
                    status: "UNDER_BEHANDLING",
                    vedtak: [vedtak[0]],
                    skalViseVedtakInfoPanel: false,
                }}
            />
        );

        expect(screen.getByRole("listitem")).toBeInTheDocument();
        expect(
            screen.queryByText(
                "Denne saken er under behandling. Når saken er ferdigbehandlet og du har fått et vedtak, vil det vises her."
            )
        ).not.toBeInTheDocument();
    });

    it("shows no-access guidance alongside decisions", () => {
        render(
            <SakBlokk
                index={0}
                sak={{
                    tittel: "Strøm",
                    referanse: "sak-1",
                    status: "IKKE_INNSYN",
                    vedtak: [vedtak[0]],
                    skalViseVedtakInfoPanel: false,
                }}
            />
        );

        expect(screen.getByRole("listitem")).toBeInTheDocument();
        expect(
            screen.getByText("Saken din vil bli behandlet, men vi kan ikke vise status for søknaden din på nav.no.")
        ).toBeInTheDocument();
    });

    it("shows the sakstittel once, as the sak heading", () => {
        render(
            <SakBlokk
                index={0}
                sak={{
                    tittel: "Husleie",
                    referanse: "sak-1",
                    vedtak: [vedtak[0]],
                    skalViseVedtakInfoPanel: false,
                }}
            />
        );

        expect(screen.getAllByRole("heading", { name: "Husleie" })).toHaveLength(1);
        expect(screen.getByRole("listitem")).toBeInTheDocument();
    });
});
