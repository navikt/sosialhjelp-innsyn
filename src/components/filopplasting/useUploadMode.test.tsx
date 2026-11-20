import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUploadMode } from "./useUploadMode";

const flag = vi.hoisted(() => ({ enabled: false }));
vi.mock("@featuretoggles/context", () => ({ useFlag: () => ({ enabled: flag.enabled }) }));

describe("useUploadMode", () => {
    it("returns tus when off and sync when on", () => {
        flag.enabled = false;
        expect(renderHook(() => useUploadMode()).result.current).toBe("tus");
        flag.enabled = true;
        expect(renderHook(() => useUploadMode()).result.current).toBe("sync");
    });
});
