import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import Filopplasting from "./Filopplasting";

const flag = vi.hoisted(() => ({ enabled: false }));
const box = vi.hoisted(() => vi.fn((_props: { mode?: string }) => null));
vi.mock("@featuretoggles/context", () => ({ useFlag: () => ({ enabled: flag.enabled }) }));
vi.mock("@components/filopplasting/OpplastingsboksTus", () => ({ default: box }));
vi.mock("@components/filopplasting/FilopplastingSection", () => ({
    default: ({ upload }: { upload: React.ReactNode }) => upload,
}));
vi.mock("@generated/vedlegg-controller/vedlegg-controller", () => ({ useHentVedleggSuspense: () => ({ data: [] }) }));
vi.mock("@generated/soknads-status-controller/soknads-status-controller", () => ({
    useHentOriginalSoknadSuspense: () => ({ data: {} }),
}));
vi.mock("@generated/saks-status-controller/saks-status-controller", () => ({
    useHentSaksStatuserSuspense: () => ({ data: [] }),
}));

const renderIt = () =>
    render(
        <NextIntlClientProvider
            locale="nb"
            messages={{}}
            onError={() => undefined}
            getMessageFallback={({ key }) => key}
        >
            <Filopplasting id="1" soknadStatus={"MOTTATT" as never} />
        </NextIntlClientProvider>
    );

describe("Filopplasting", () => {
    it("uses tus mode when toggle is off", () => {
        flag.enabled = false;
        renderIt();
        expect(box.mock.calls.at(-1)?.[0].mode).toBe("tus");
    });
    it("uses sync mode when toggle is on", () => {
        flag.enabled = true;
        renderIt();
        expect(box.mock.calls.at(-1)?.[0].mode).toBe("sync");
    });
});
