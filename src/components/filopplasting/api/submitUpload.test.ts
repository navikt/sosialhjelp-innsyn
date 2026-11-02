import { afterEach, describe, expect, it, vi } from "vitest";

import { submitUpload } from "./submitUpload";

const request = {
    submissionId: "submission-id",
    body: {
        fiksDigisosId: "digisos-id",
        metadata: {
            dokumentKontekst: "ettersendelse" as const,
            type: "klage",
        },
    },
};

describe("submitUpload", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("submits the TUS submission with its metadata", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
        vi.stubGlobal("fetch", fetchMock);

        await submitUpload(request);

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("/submission/submission-id/submit"),
            expect.objectContaining({
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request.body),
            })
        );
    });

    it("sends klageId when submitting a klage ettersendelse", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
        vi.stubGlobal("fetch", fetchMock);
        const klageId = "1af0c6c7-e9d1-4ce0-b898-5efde36c9f9e";

        await submitUpload({
            ...request,
            body: { ...request.body, klageId },
        });

        expect(fetchMock).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                body: JSON.stringify({ ...request.body, klageId }),
            })
        );
    });

    it("returns upload-api validation errors", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ errors: ["NO_FILES"] }), {
                    status: 422,
                    headers: { "Content-Type": "application/json" },
                })
            )
        );

        await expect(submitUpload(request)).rejects.toEqual({ errors: ["NO_FILES"] });
    });

    it("returns a generic error for other responses", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500, statusText: "Error" })));

        await expect(submitUpload(request)).rejects.toThrow("Feil ved opplasting av vedlegg: 500 Error");
    });
});
