import { render, screen } from "@test/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EttersendelseDto, VedleggResponse } from "@generated/model";
import messages from "../../../../../../../messages/nb.json";
import KlageDokumentasjon from "./KlageDokumentasjon";

vi.mock("next-intl/server", () => ({
    getTranslations: async () => (key: keyof typeof messages.KlageDokumenter) => messages.KlageDokumenter[key],
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
    afterEach(() => vi.restoreAllMocks());

    it("shows the klage PDF, uploaded attachments and subsequent submissions in the shared list", async () => {
        vi.spyOn(Date, "now").mockReturnValue(Date.parse("2025-01-22T22:59:59.999Z"));
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
                timestampSendt: Date.parse("2025-01-01T13:00:00Z"),
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
        expect(screen.getByText("Tips til å sende inn dokumentasjon")).toBeInTheDocument();
        expect(screen.queryByText(messages.KlageDokumenter.fristUtlopt)).not.toBeInTheDocument();
    });

    it("shows the documents and expiry message instead of the upload and tips after the deadline", async () => {
        vi.spyOn(Date, "now").mockReturnValue(Date.parse("2025-01-22T23:00:00Z"));

        render(
            await KlageDokumentasjon({
                fiksDigisosId: "soknad-1",
                klageId: "klage-1",
                klagePdf: fil("klage.pdf", "2025-01-01"),
                opplastedeVedlegg: [fil("vedlegg.pdf", "2025-01-02")],
                ettersendelser: [{ vedlegg: [fil("ettersendt.pdf", "2025-01-03")] }] as EttersendelseDto[],
                timestampSendt: Date.parse("2025-01-01T13:00:00Z"),
            })
        );

        expect(screen.getByRole("heading", { name: "Vedlagt dokumentasjon", level: 2 })).toBeInTheDocument();
        expect(screen.getByText(messages.KlageDokumenter.fristUtlopt)).toBeInTheDocument();
        expect(screen.queryByText("Opplasting av klage")).not.toBeInTheDocument();
        expect(screen.queryByText("Tips til å sende inn dokumentasjon")).not.toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Dokumenter", level: 3 })).toBeInTheDocument();
        expect(screen.getByText("klage.pdf")).toBeInTheDocument();
        expect(screen.getByText("vedlegg.pdf")).toBeInTheDocument();
        expect(screen.getByText("ettersendt.pdf")).toBeInTheDocument();
    });
});
