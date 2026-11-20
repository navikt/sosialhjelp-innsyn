import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadFile } from "./uploadFile";
import { deleteFile } from "./deleteFile";

const params = {
    file: new File(["x"], "a.pdf", { type: "application/pdf" }),
    contextId: "ctx",
    correlationId: "11111111-1111-1111-1111-111111111111",
    targetFields: { fiksDigisosId: "digisos" },
};
const dto = {
    upload: { id: "u1", originalFilename: "a.pdf", status: "COMPLETE", converted: false },
    submissionId: "s1",
};
const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("uploadFile", () => {
    afterEach(() => vi.unstubAllGlobals());

    it.each([200, 201])("returns stored for %i and sends form fields", async (status) => {
        const fetchMock = vi.fn().mockResolvedValue(json(dto, status));
        vi.stubGlobal("fetch", fetchMock);
        const result = await uploadFile(params);
        expect(result).toMatchObject({
            kind: "stored",
            submissionId: "s1",
            upload: { id: "u1", originalFilename: "a.pdf" },
        });
        expect(fetchMock.mock.calls[0][0]).toContain("/files");
        const body = fetchMock.mock.calls[0][1].body as FormData;
        expect((body.get("file") as File).name).toBe("a.pdf");
        expect(body.get("contextId")).toBe("ctx");
        expect(body.get("correlationId")).toBe(params.correlationId);
        expect(body.get("fiksDigisosId")).toBe("digisos");
        expect(body.get("automaticCleanup")).toBe("true");
    });

    it("sends navEksternRefId and no fiksDigisosId for klage targets", async () => {
        const fetchMock = vi.fn().mockResolvedValue(json(dto, 201));
        vi.stubGlobal("fetch", fetchMock);
        await uploadFile({ ...params, targetFields: { navEksternRefId: "ref-1" } });
        const body = fetchMock.mock.calls[0][1].body as FormData;
        expect(body.get("navEksternRefId")).toBe("ref-1");
        expect(body.has("fiksDigisosId")).toBe(false);
    });

    it("maps 422 to rejected", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ validations: ["ENCRYPTED_PDF"] }, 422)));
        expect(await uploadFile(params)).toEqual({ kind: "rejected", validations: ["ENCRYPTED_PDF"] });
    });

    it("maps 502 to failed with stage", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ stage: "STORAGE" }, 502)));
        expect(await uploadFile(params)).toEqual({ kind: "failed", stage: "STORAGE" });
    });

    it("maps 403, 413, 400 and 500", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 403 })));
        expect(await uploadFile(params)).toEqual({ kind: "forbidden" });
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("big", { status: 413 })));
        expect(await uploadFile(params)).toEqual({ kind: "tooLarge" });
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("bad", { status: 400 })));
        expect(await uploadFile(params)).toEqual({ kind: "invalid" });
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
        expect(await uploadFile(params)).toEqual({ kind: "failed" });
    });

    it("maps network errors to failed", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("net")));
        expect(await uploadFile(params)).toEqual({ kind: "failed" });
    });
});

describe("deleteFile", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("sends DELETE to /files/{id}", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
        vi.stubGlobal("fetch", fetchMock);
        await deleteFile("u1");
        expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/files\/u1$/), { method: "DELETE" });
    });

    it("throws on 404", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })));
        await expect(deleteFile("u1")).rejects.toThrow();
    });
});
