import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@test/test-utils";
import StegOppsummering from "./StegOppsummering";

const baseProps = {
    isLoading: false,
    isError: false,
    onTilbake: vi.fn(),
    formValues: { background: "Begrunnelse" },
    uploads: [],
    otherInfo: { vedtakMottatt: "2025-01-01" },
};

describe("StegOppsummering", () => {
    it("viser ingen varsler som standard", () => {
        render(<StegOppsummering {...baseProps} />);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("viser feilvarsel når sending feiler", () => {
        render(<StegOppsummering {...baseProps} isError />);
        expect(screen.getByRole("alert")).toHaveTextContent(/Sending av klage feilet/);
    });

    it("viser varsel når klage ikke er tilgjengelig", () => {
        render(<StegOppsummering {...baseProps} ikkeTilgjengelig />);
        expect(screen.getByRole("alert")).toHaveTextContent(/Klage er ikke tilgjengelig/);
    });
});
