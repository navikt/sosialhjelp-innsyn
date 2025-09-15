import { expect, describe, it, vi, Mock } from "vitest";

import { render } from "../../test/test-utils";

import DriftsmeldingVedlegg from "./DriftsmeldingVedlegg";
import { useFileUploadError } from "./lib/useFileUploadError";

vi.mock("./lib/useFileUploadError", () => ({
    useFileUploadError: vi.fn(),
}));

describe("DriftsmeldingVedlegg", () => {
    it("renders null when there is no file upload error", () => {
        (useFileUploadError as Mock).mockReturnValue(null);
        expect(render(<DriftsmeldingVedlegg />).asFragment()).toMatchSnapshot();
    });

    it("renders DriftsmeldingAlert when there is a file upload error", () => {
        (useFileUploadError as Mock).mockReturnValue("driftsmelding.kanIkkeSendeVedlegg");
        expect(render(<DriftsmeldingVedlegg />).asFragment()).toMatchSnapshot();
    });
});
