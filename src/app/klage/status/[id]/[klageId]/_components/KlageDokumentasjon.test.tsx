import { render, screen } from "@test/test-utils";
import { describe, expect, it, vi } from "vitest";
import { EttersendelseDto, VedleggResponse } from "@generated/model";
import KlageDokumentasjon from "./KlageDokumentasjon";

vi.mock("next-intl/server", () => ({
    getTranslations: async () => (key: string) =>
        ({ klagePdfDefaultTittel: "Klage på vedtak", ettersendelseDefaultTittel: "Ukjent filnavn" })[key],
}));
vi.mock("./KlageEttersendelse", () => ({ default: () => <div>Opplasting av klage</div> }));

const fil = (filnavn: string, datoLagtTil: string): VedleggResponse => ({
    filnavn,
    datoLagtTil,
    url: `/${filnavn}`,
    storrelse: 1024,
    type: "klage_pdf",
    tilleggsinfo: "annet",
});

describe("KlageDokumentasjon", () => {
    it("shows the klage PDF, uploaded attachments and subsequent submissions in the shared list", async () => {
        const klagePdf = fil("klage.pdf", "2025-01-01");
        const opplastedeVedlegg = [fil("vedlegg.pdf", "2025-01-02")];
        const ettersendelser = [{ vedlegg: [fil("ettersendt.pdf", "2025-01-03")] }] as EttersendelseDto[];

        render(
            await KlageDokumentasjon({
                fiksDigisosId: "soknad-1",
                klageId: "klage-1",
                klagePdf,
                opplastedeVedlegg,
                ettersendelser,
            })
        );

        expect(screen.getByText("Opplasting av klage")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Dokumenter", level: 3 })).toBeInTheDocument();
        expect(screen.getByText("klage.pdf")).toBeInTheDocument();
        expect(screen.getByText("vedlegg.pdf")).toBeInTheDocument();
        expect(screen.getByText("ettersendt.pdf")).toBeInTheDocument();
        expect(screen.getByText("Sendt 02.01.2025")).toBeInTheDocument();
        expect(screen.getByText("Sendt 03.01.2025")).toBeInTheDocument();
        expect(screen.queryByText(/klage_pdf/)).not.toBeInTheDocument();
    });
});
