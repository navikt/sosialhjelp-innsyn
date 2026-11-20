import { useFlag } from "@featuretoggles/context";
import type { UploadMode } from "./api/useDocumentState";

export const useUploadMode = (): UploadMode =>
    useFlag("sosialhjelp.upload.forenklet_opplasting").enabled ? "sync" : "tus";
