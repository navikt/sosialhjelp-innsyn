import { render, screen } from "@test/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Saker from "./Saker";

const mockSaker = vi.hoisted(() => ({ current: [] as Array<Record<string, unknown>> }));

vi.mock("next/navigation", () => ({ useParams: () => ({ id: "soknad-1" }) }));
vi.mock("@generated/saks-status-controller/saks-status-controller", () => ({
    useHentSaksStatuserSuspense: () => ({ data: mockSaker.current }),
}));
vi.mock("@generated/klage-controller/klage-controller", () => ({
    useHentKlager: () => ({ data: undefined }),
    useKanSendeKlage: () => ({ data: undefined }),
}));

const vedtak = {
    id: "vedtak-1",
    vedtaksFilUrl: "https://example.test/vedtak-1",
    dato: "2026-03-03",
    utfall: "INNVILGET" as const,
};

describe("Saker", () => {
    beforeEach(() => {
        mockSaker.current = [];
    });

    it("renders nothing when there are no saker", () => {
        const { container } = render(<Saker />);

        expect(container).toBeEmptyDOMElement();
    });

    it("shows a generic heading and no status information for a single sak with vedtak", () => {
        mockSaker.current = [
            {
                tittel: "Housing",
                referanse: "sak-1",
                status: "UNDER_BEHANDLING",
                vedtak: [vedtak],
                skalViseVedtakInfoPanel: false,
            },
        ];

        render(<Saker />);

        expect(screen.getByRole("heading", { name: "Vedtak" })).toHaveAttribute("id", "vedtak-heading");
        expect(screen.queryByRole("heading", { name: "Housing" })).not.toBeInTheDocument();
        expect(screen.getByRole("listitem")).toBeInTheDocument();
        expect(
            screen.queryByText(
                "Denne saken er under behandling. Når saken er ferdigbehandlet og du har fått et vedtak, vil det vises her."
            )
        ).not.toBeInTheDocument();
    });

    it("renders nothing for a single sak without vedtak", () => {
        mockSaker.current = [
            {
                tittel: "Housing",
                referanse: "sak-1",
                status: "UNDER_BEHANDLING",
                vedtak: [],
                skalViseVedtakInfoPanel: false,
            },
        ];

        const { container } = render(<Saker />);

        expect(container).toBeEmptyDOMElement();
    });

    it("shows each sak and puts saker with vedtak first when there are multiple", () => {
        mockSaker.current = [
            {
                tittel: "Housing",
                referanse: "sak-without-vedtak",
                status: "UNDER_BEHANDLING",
                vedtak: [],
                skalViseVedtakInfoPanel: false,
            },
            {
                tittel: "Electricity",
                referanse: "sak-with-vedtak",
                status: "FERDIGBEHANDLET",
                vedtak: [vedtak],
                skalViseVedtakInfoPanel: false,
            },
        ];

        render(<Saker />);

        expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
            "Electricity",
            "Housing",
        ]);
        expect(screen.getByRole("listitem")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Denne saken er under behandling. Når saken er ferdigbehandlet og du har fått et vedtak, vil det vises her."
            )
        ).toBeInTheDocument();
    });
});
