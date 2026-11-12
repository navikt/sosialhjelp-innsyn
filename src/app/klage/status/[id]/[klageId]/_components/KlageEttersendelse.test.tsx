import { act, fireEvent, render, screen, waitFor } from "@test/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentState } from "@components/filopplasting/api/useDocumentState";
import KlageEttersendelse from "./KlageEttersendelse";

const mocks = vi.hoisted(() => ({
    onUpdate: undefined as ((state: Partial<DocumentState>) => void) | undefined,
    refresh: vi.fn(),
    submit: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useParams: () => ({ id: "soknad-1" }),
    useRouter: () => ({ refresh: mocks.refresh }),
}));
vi.mock("@components/filopplasting/api/openEventChannel", () => ({
    eventstreamUrl: () => "/status",
    openEventChannel: (_url: string, onUpdate: (state: Partial<DocumentState>) => void) => {
        mocks.onUpdate = onUpdate;
        return () => {};
    },
}));
vi.mock("@components/filopplasting/api/submitUpload", () => ({ submitUpload: mocks.submit }));
vi.mock("../../../../../umami", () => ({ umamiCustomTrack: vi.fn() }));
vi.mock("@components/filopplasting/FileSelectNew", () => ({
    default: ({ description }: { description: string }) => <p>{description}</p>,
}));

const makeUploadReady = () => {
    act(() =>
        mocks.onUpdate?.({
            submissionId: "submission-1",
            uploads: [
                {
                    id: "upload-1",
                    originalFilename: "vedlegg.pdf",
                    status: "COMPLETE",
                    filId: "fil-1",
                    converted: false,
                },
            ],
        })
    );
};

describe("KlageEttersendelse", () => {
    beforeEach(() => {
        mocks.onUpdate = undefined;
        mocks.refresh.mockReset();
        mocks.submit.mockReset();
    });

    it("sends the uploaded documents to the klage and refreshes the document list", async () => {
        mocks.submit.mockResolvedValue(undefined);
        render(<KlageEttersendelse fiksDigisosId="soknad-1" klageId="klage-1" contextId="context-1" />);

        expect(screen.getByText(/betydning for klagen din/)).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Send inn" })).not.toBeInTheDocument();
        makeUploadReady();
        fireEvent.click(screen.getByRole("button", { name: "Send inn" }));

        await waitFor(() =>
            expect(mocks.submit).toHaveBeenCalledWith({
                submissionId: "submission-1",
                body: {
                    fiksDigisosId: "soknad-1",
                    klageId: "klage-1",
                    metadata: {
                        dokumentKontekst: "ettersendelse",
                        type: "klage",
                        tilleggsinfo: "annet",
                        hendelsetype: "bruker",
                        hendelsereferanse: "klage-1",
                        innsendelsesfrist: "",
                    },
                },
            })
        );
        expect(await screen.findByText("Dokumentasjonen din ble sendt inn.")).toBeInTheDocument();
        expect(mocks.refresh).toHaveBeenCalledOnce();
        expect(screen.queryByRole("button", { name: "Send inn" })).not.toBeInTheDocument();
    });

    it("shows a dismissible error and retains files when sending fails", async () => {
        mocks.submit.mockRejectedValue(new Error("submission failed"));
        render(<KlageEttersendelse fiksDigisosId="soknad-1" klageId="klage-1" contextId="context-1" />);
        makeUploadReady();
        fireEvent.click(screen.getByRole("button", { name: "Send inn" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Det oppstod en feil under opplastingen.");
        expect(screen.getByRole("button", { name: "Send inn" })).toBeEnabled();
        expect(mocks.refresh).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole("button", { name: "Lukk" }));
        await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    });
});
