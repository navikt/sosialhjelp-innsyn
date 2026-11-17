import { beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import type { DocumentState, UploadState, useDocumentState } from "@components/filopplasting/api/useDocumentState";
import userEvent from "@testing-library/user-event";
import { queryClient, render, screen, waitFor } from "@test/test-utils";
import { getHentKlagerQueryKey } from "@generated/klage-controller/klage-controller";
import { getSendKlageMockHandler } from "@generated/klage-controller/klage-controller.msw";
import { getHentHendelserBetaQueryKey } from "@generated/hendelse-controller/hendelse-controller";
import { server } from "../../../../../../mocks/server";
import { render, screen, waitFor } from "@test/test-utils";

import KlageForm from "./KlageForm";
const mocks = vi.hoisted(() => ({
    replace: vi.fn(),
    deleteSubmission: vi.fn(),
    docState: {} as DocumentState,
}));

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@navikt/next-logger", () => ({ logger: { error: vi.fn() } }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace, push: vi.fn() }) }));
vi.mock("@navikt/next-logger", () => ({ logger: { warn: vi.fn(), error: vi.fn() } }));
vi.mock("@components/filopplasting/api/deleteSubmission", () => ({ deleteSubmission: mocks.deleteSubmission }));
vi.mock("@components/filopplasting/api/useDocumentState", () => ({
    useDocumentState: () => ({ state: { uploads: [] }, addUploads: vi.fn(), removeUpload: vi.fn() }),
    useDocumentState: () =>
        ({
            state: mocks.docState,
            addUploads: vi.fn(),
            removeUpload: vi.fn(),
            allFilesUploaded: true,
            allValidated: true,
            hasFormErrors: false,
        }) satisfies Partial<ReturnType<typeof useDocumentState>>,
}));
vi.mock("./steg/StegBegrunnelse", () => ({
    default: ({ onGaVidere }: { onGaVidere: () => void }) => (
        <button type="button" onClick={onGaVidere}>
            Neste
    default: ({ onForkastKlage }: { onForkastKlage: () => void }) => (
        <button type="button" onClick={onForkastKlage}>
            forkast
        </button>
    ),
}));
vi.mock("./steg/StegOppsummering", () => ({
    default: ({ isError }: { isError: boolean }) => (
        <>
            <button type="submit">Send klage</button>
            {isError && <p role="alert">Sending feilet</p>}
        </>
    ),
}));

const historyKey = getHentHendelserBetaQueryKey("soknad-1");
const complaintsKey = getHentKlagerQueryKey("soknad-1");
const otherHistoryKey = getHentHendelserBetaQueryKey("soknad-2");
import KlageForm from "./KlageForm";

const submitComplaint = async () => {
    const user = userEvent.setup();
    render(<KlageForm fiksDigisosId="soknad-1" vedtakId="vedtak-1" klageId="klage-1" vedtakMottatt="2025-11-15" />);
    await user.click(screen.getByRole("button", { name: "Neste" }));
    await user.click(await screen.findByRole("button", { name: "Send klage" }));
const completeUpload: UploadState = {
    id: "upload-1",
    originalFilename: "fil.pdf",
    status: "COMPLETE",
    converted: false,
};

describe("KlageForm", () => {
const renderForm = () =>
    render(<KlageForm fiksDigisosId="soknad-1" vedtakId="vedtak-1" klageId="klage-1" vedtakMottatt="2025-01-01" />);

describe("KlageForm forkast", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.setQueryData(historyKey, []);
        queryClient.setQueryData(complaintsKey, []);
        queryClient.setQueryData(otherHistoryKey, []);
        mocks.deleteSubmission.mockResolvedValue(undefined);
    });

    it("invalidates complaints and history for the application after successful submission", async () => {
        server.use(getSendKlageMockHandler());
    it("deletes by submissionId, not klageId, then navigates to the soknad", async () => {
        mocks.docState = { submissionId: "submission-9", uploads: [completeUpload] };
        renderForm();
        await userEvent.click(screen.getByText("forkast"));
        await userEvent.click(await screen.findByRole("button", { name: "Ja, forkast klagen" }));

        await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/soknad/soknad-1"));
        expect(mocks.deleteSubmission.mock.calls[0][0]).toBe("submission-9");
    });

        await submitComplaint();
    it("still navigates when the delete fails", async () => {
        mocks.docState = { submissionId: "submission-9", uploads: [completeUpload] };
        mocks.deleteSubmission.mockRejectedValue(new Error("boom"));
        renderForm();
        await userEvent.click(screen.getByText("forkast"));
        await userEvent.click(await screen.findByRole("button", { name: "Ja, forkast klagen" }));

        await waitFor(() => expect(push).toHaveBeenCalledWith("/klage/kvittering/soknad-1/klage-1"));
        expect(queryClient.getQueryState(historyKey)?.isInvalidated).toBe(true);
        expect(queryClient.getQueryState(complaintsKey)?.isInvalidated).toBe(true);
        expect(queryClient.getQueryState(otherHistoryKey)?.isInvalidated).toBe(false);
        await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/soknad/soknad-1"));
    });

    it("does not invalidate queries or navigate when submission fails", async () => {
        server.use(
            http.post("*/api/v1/innsyn/soknad-1/klage/send", () =>
                HttpResponse.json({ error: "Sending feilet" }, { status: 500 })
            )
        );
    it("navigates without deleting when there are no uploads", async () => {
        mocks.docState = { submissionId: "submission-9", uploads: [] };
        renderForm();
        await userEvent.click(screen.getByText("forkast"));

        await submitComplaint();

        expect(await screen.findByRole("alert")).toHaveTextContent("Sending feilet");
        expect(queryClient.getQueryState(historyKey)?.isInvalidated).toBe(false);
        expect(queryClient.getQueryState(complaintsKey)?.isInvalidated).toBe(false);
        expect(push).not.toHaveBeenCalled();
        expect(mocks.replace).toHaveBeenCalledWith("/soknad/soknad-1");
        expect(mocks.deleteSubmission).not.toHaveBeenCalled();
    });
});
