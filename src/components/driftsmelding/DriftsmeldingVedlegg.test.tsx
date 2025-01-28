import { render } from "@testing-library/react";

import DriftsmeldingVedlegg from "./DriftsmeldingVedlegg";
import { useFileUploadError } from "./lib/useFileUploadError";

jest.mock("./lib/useFileUploadError", () => ({
    useFileUploadError: jest.fn(),
}));

describe("DriftsmeldingVedlegg", () => {
    it("renders null when there is no file upload error", () => {
        (useFileUploadError as jest.Mock).mockReturnValue(null);
        expect(render(<DriftsmeldingVedlegg />).asFragment()).toMatchSnapshot();
    });

    it("renders DriftsmeldingAlert when there is a file upload error", () => {
        (useFileUploadError as jest.Mock).mockReturnValue("driftsmelding.kanIkkeSendeVedlegg");
        expect(render(<DriftsmeldingVedlegg />).asFragment()).toMatchSnapshot();
    });

    it("renders DriftsmeldingAlert if søknadinfo.isBroken is true", () => {
        (useFileUploadError as jest.Mock).mockReturnValue("driftsmelding.vedlegg.vedleggMangler");
        expect(render(<DriftsmeldingVedlegg className="custom-class" />).asFragment()).toMatchSnapshot();
    });
});
