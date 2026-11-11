import { act, fireEvent, render, screen, waitFor } from "@test/test-utils";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentState, UploadState, ValidationCode } from "@components/filopplasting/api/useDocumentState";
import KlageForm from "./KlageForm";

const mocks = vi.hoisted(() => ({
    onUpdate: undefined as ((state: Partial<DocumentState>) => void) | undefined,
    send: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
    useParams: () => ({ id: "soknad-1" }),
}));
vi.mock("@navikt/next-logger", () => ({ logger: { warn: vi.fn(), error: vi.fn() } }));
vi.mock("@components/filopplasting/api/openEventChannel", () => ({
    eventstreamUrl: () => "/status",
    openEventChannel: (_url: string, onUpdate: (state: Partial<DocumentState>) => void) => {
        mocks.onUpdate = onUpdate;
        return () => {};
    },
}));
vi.mock("@components/filopplasting/FileSelectNew", () => ({ default: () => null }));
vi.mock("@generated/klage-controller/klage-controller", () => ({
    useSendKlage: () => ({ mutateAsync: mocks.send }),
    getHentKlagerQueryKey: () => [],
}));

const upload: UploadState = {
    id: "upload-1",
    originalFilename: "vedlegg.pdf",
    converted: false,
    status: "PENDING",
};

const updateUploads = (state: Partial<DocumentState>) => {
    act(() => mocks.onUpdate?.({ submissionId: "submission-1", ...state }));
};

describe("KlageForm opplasting", () => {
    beforeEach(() => {
        mocks.onUpdate = undefined;
        mocks.send.mockReset();
    });

    it("venter på at alle vedlegg er fullført før brukeren kan gå videre", async () => {
        render(<KlageForm fiksDigisosId="soknad-1" vedtakId="vedtak-1" klageId="klage-1" vedtakMottatt="2025-01-01" />);
        updateUploads({ uploads: [upload, { ...upload, id: "upload-2", status: "COMPLETE", filId: "fil-2" }] });

        const button = screen.getByRole("button", { name: "Se oppsummering" });
        expect(button).toBeDisabled();
        expect(button).toHaveAccessibleDescription(/Vent til alle vedlegg er lastet opp\./);

        updateUploads({ uploads: [{ ...upload, status: "PROCESSING", filId: "fil-1" }] });
        expect(button).toBeDisabled();

        updateUploads({ uploads: [{ ...upload, status: "COMPLETE" }] });
        expect(button).toBeDisabled();

        updateUploads({ uploads: [{ ...upload, status: "COMPLETE", filId: "fil-1" }] });
        expect(button).toBeEnabled();
        await userEvent.click(button);
        expect(await screen.findByText("Oppsummering av klagen")).toBeInTheDocument();
    });

    it.each([
        { name: "valideringsfeil på en fil", uploads: [{ ...upload, validations: [ValidationCode.INVALID_PDF] }] },
        {
            name: "valideringsfeil på opplastingen",
            uploads: [{ ...upload, status: "COMPLETE" as const, filId: "fil-1" }],
            validations: [ValidationCode.TOO_MANY_FILES],
        },
        { name: "mislykket opplasting", uploads: [{ ...upload, status: "FAILED" as const }] },
    ])("hindrer videre navigering ved $name", ({ uploads, validations }) => {
        render(<KlageForm fiksDigisosId="soknad-1" vedtakId="vedtak-1" klageId="klage-1" vedtakMottatt="2025-01-01" />);
        updateUploads({ uploads, validations });

        const button = screen.getByRole("button", { name: "Se oppsummering" });
        expect(button).toBeDisabled();
        expect(button).toHaveAccessibleDescription(/Fjern vedlegg med feil før du går videre\./);
    });

    it("tillater begrunnelse uten vedlegg og hindrer innsending fra første steg", async () => {
        const { container } = render(
            <KlageForm fiksDigisosId="soknad-1" vedtakId="vedtak-1" klageId="klage-1" vedtakMottatt="2025-01-01" />
        );
        fireEvent.change(screen.getByRole("textbox", { name: "Hvorfor er du uenig i vedtaket?" }), {
            target: { value: "Begrunnelse" },
        });
        const button = screen.getByRole("button", { name: "Se oppsummering" });
        expect(button).toBeEnabled();
        await act(async () => {
            fireEvent.submit(container.querySelector("form")!);
        });
        await waitFor(() => expect(mocks.send).not.toHaveBeenCalled());
        await userEvent.click(button);
        expect(await screen.findByText("Oppsummering av klagen")).toBeInTheDocument();
    });
});
