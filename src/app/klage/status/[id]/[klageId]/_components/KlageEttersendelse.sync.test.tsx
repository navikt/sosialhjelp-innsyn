import { fireEvent, render, screen, waitFor } from "@test/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import KlageEttersendelse from "./KlageEttersendelse";

const mocks = vi.hoisted(() => ({ submit: vi.fn() }));

vi.mock("@featuretoggles/context", () => ({ useFlag: () => ({ enabled: true }) }));
vi.mock("next/navigation", () => ({
    useParams: () => ({ id: "soknad-1" }),
    useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("@components/filopplasting/api/submitUpload", () => ({ submitUpload: mocks.submit }));
vi.mock("../../../../../umami", () => ({ umamiCustomTrack: vi.fn() }));

const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const emptyStatus = { submissionId: "", uploads: [], validations: [], status: "OPEN" };
const stored = {
    upload: { id: "u1", filId: "f1", originalFilename: "a.pdf", status: "COMPLETE", converted: false },
    submissionId: "s1",
};

describe("KlageEttersendelse med forenklet opplasting", () => {
    let fetchMock: ReturnType<typeof vi.fn>;
    beforeEach(() => {
        mocks.submit.mockReset();
        fetchMock = vi.fn(async (url: string, init?: RequestInit) =>
            init?.method === "POST" ? json(stored, 201) : json(emptyStatus, 200)
        );
        vi.stubGlobal("fetch", fetchMock);
    });
    afterEach(() => vi.unstubAllGlobals());

    const uploadOne = async () => {
        const { container } = render(<KlageEttersendelse fiksDigisosId="soknad-1" klageId="klage-1" contextId="ctx" />);
        const input = container.querySelector("input[type=file]") as HTMLInputElement;
        fireEvent.change(input, { target: { files: [new File(["x"], "a.pdf", { type: "application/pdf" })] } });
        await waitFor(() => expect(fetchMock.mock.calls.some(([, init]) => init?.method === "POST")).toBe(true));
        return container;
    };

    it("sends navEksternRefId and no fiksDigisosId", async () => {
        await uploadOne();
        const call = fetchMock.mock.calls.find(([, init]) => init?.method === "POST")!;
        expect(call[0]).toContain("/files");
        const body = call[1].body as FormData;
        expect(body.get("navEksternRefId")).toBeTruthy();
        expect(body.has("fiksDigisosId")).toBe(false);
        expect(body.get("contextId")).toBe("ctx");
    });

    it("shows missing filenames on FILES_MISSING and refreshes status", async () => {
        mocks.submit.mockRejectedValue({
            errors: ["FILES_MISSING"],
            missing: [{ uploadId: "u1", originalFilename: "mangler.pdf" }],
        });
        await uploadOne();
        fireEvent.click(await screen.findByRole("button", { name: "Send inn" }));
        const alert = await screen.findByRole("alert");
        expect(alert).toHaveTextContent("Noen filer ble ikke funnet hos oss");
        expect(alert).toHaveTextContent("mangler.pdf");
        const statusCalls = () => fetchMock.mock.calls.filter(([, init]) => init?.method !== "POST").length;
        await waitFor(() => expect(statusCalls()).toBeGreaterThan(1));
    });

    it("shows message on UPLOADS_IN_PROGRESS", async () => {
        mocks.submit.mockRejectedValue({ errors: ["UPLOADS_IN_PROGRESS"] });
        await uploadOne();
        fireEvent.click(await screen.findByRole("button", { name: "Send inn" }));
        expect(await screen.findByRole("alert")).toHaveTextContent("Opplastinger pågår");
    });
});
