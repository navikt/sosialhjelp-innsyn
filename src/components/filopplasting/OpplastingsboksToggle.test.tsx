import { afterEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OpplastingsboksTus from "./OpplastingsboksTus";

vi.mock("next/navigation", () => ({ useParams: () => ({ id: "soknad-1" }) }));
vi.mock("@generated/oppgave-controller-v-2/oppgave-controller-v-2", () => ({
    useGetVedleggForOppgave: () => ({ data: [] }),
    getGetOppgaverBetaQueryKey: () => [],
    getGetDokumentasjonkravBetaQueryKey: () => [],
}));

class FakeEventSource {
    static count = 0;
    constructor() {
        FakeEventSource.count++;
    }
    close() {}
}

const renderBox = (mode?: "sync") =>
    render(
        <QueryClientProvider client={new QueryClient()}>
            <NextIntlClientProvider
                locale="nb"
                messages={{}}
                onError={() => undefined}
                getMessageFallback={({ key }) => key}
            >
                <OpplastingsboksTus
                    metadata={{ dokumentKontekst: "ettersendelse", type: "annet", tilleggsinfo: "annet" }}
                    uploadContextId="ctx"
                    mode={mode}
                />
            </NextIntlClientProvider>
        </QueryClientProvider>
    );

describe("OpplastingsboksTus mode", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        FakeEventSource.count = 0;
    });

    it("tus mode opens SSE and does not call /files", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        vi.stubGlobal("EventSource", FakeEventSource);
        renderBox();
        expect(FakeEventSource.count).toBe(1);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("sync mode fetches status and opens no EventSource", async () => {
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(JSON.stringify({ submissionId: "", uploads: [], validations: [], status: "OPEN" }), {
                status: 200,
            })
        );
        vi.stubGlobal("fetch", fetchMock);
        vi.stubGlobal("EventSource", FakeEventSource);
        renderBox("sync");
        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.calls[0][0]).toContain("/submission/context/ctx");
        expect(FakeEventSource.count).toBe(0);
    });
});
