import { render, screen } from "@test/test-utils";
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
        render(<VedtakPanel vedtak={vedtak[0]} />);

        expect(screen.getByRole("link", { name: "Se informasjon om utbetalingen" })).toBeInTheDocument();
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
        expect(screen.getByRole("heading", { name: "older" })).toBeInTheDocument();
    });

    it("shows an info card instead of a vedtak panel when a sak is under treatment", () => {
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

        expect(screen.getByRole("heading", { name: "Strøm" })).toBeInTheDocument();
        expect(
            screen.getByText(
                "Denne saken er under behandling. Når saken er ferdigbehandlet og du har fått et vedtak, vil det vises her."
            )
        ).toBeInTheDocument();
        expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("uses the sak heading instead of repeating it in a multi-sak vedtak panel", () => {
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
