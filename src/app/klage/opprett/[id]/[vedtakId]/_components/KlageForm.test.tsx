import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@test/test-utils";

const mocks = vi.hoisted(() => ({
    replace: vi.fn(),
    deleteSubmission: vi.fn(),
    docState: {} as { submissionId?: string; uploads?: { status: string }[] },
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace, push: vi.fn() }) }));
vi.mock("@navikt/next-logger", () => ({ logger: { warn: vi.fn(), error: vi.fn() } }));
vi.mock("@components/filopplasting/api/deleteSubmission", () => ({ deleteSubmission: mocks.deleteSubmission }));
vi.mock("@components/filopplasting/api/useDocumentState", () => ({
    useDocumentState: () => ({ state: mocks.docState, addUploads: vi.fn(), removeUpload: vi.fn() }),
}));
vi.mock("./steg/StegBegrunnelse", () => ({
    default: ({ onForkastKlage }: { onForkastKlage: () => void }) => (
        <button type="button" onClick={onForkastKlage}>
            forkast
        </button>
    ),
}));

import KlageForm from "./KlageForm";

const renderForm = () =>
    render(<KlageForm fiksDigisosId="soknad-1" vedtakId="vedtak-1" klageId="klage-1" vedtakMottatt="2025-01-01" />);

describe("KlageForm forkast", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.deleteSubmission.mockResolvedValue(undefined);
    });

    it("deletes by submissionId, not klageId, then navigates to the soknad", async () => {
        mocks.docState = { submissionId: "submission-9", uploads: [{ status: "COMPLETE" }] };
        renderForm();
        await userEvent.click(screen.getByText("forkast"));
        await userEvent.click(await screen.findByRole("button", { name: "Ja, forkast klagen" }));

        await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/soknad/soknad-1"));
        expect(mocks.deleteSubmission.mock.calls[0][0]).toBe("submission-9");
    });

    it("still navigates when the delete fails", async () => {
        mocks.docState = { submissionId: "submission-9", uploads: [{ status: "COMPLETE" }] };
        mocks.deleteSubmission.mockRejectedValue(new Error("boom"));
        renderForm();
        await userEvent.click(screen.getByText("forkast"));
        await userEvent.click(await screen.findByRole("button", { name: "Ja, forkast klagen" }));

        await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/soknad/soknad-1"));
    });

    it("navigates without deleting when there are no uploads", async () => {
        mocks.docState = { submissionId: "submission-9", uploads: [] };
        renderForm();
        await userEvent.click(screen.getByText("forkast"));

        expect(mocks.replace).toHaveBeenCalledWith("/soknad/soknad-1");
        expect(mocks.deleteSubmission).not.toHaveBeenCalled();
    });
});
