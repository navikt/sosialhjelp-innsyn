import { render } from "@testing-library/react";

import useIsAalesundBlocked from "../../hooks/useIsAalesundBlocked";
import { screen } from "../../test/test-utils";

import { DriftsmeldingAalesund } from "./DriftsmeldingAalesund";

const TITLE = "Ålesund: ettersending av vedlegg blir ikke mulig";
const MESSAGE =
    "Grunnet kommunedelingen av Ålesund kommune vil det aldri bli mulig å ettersende vedlegg til søknader sendt inn før 1. januar 2024.";

jest.mock("../../hooks/useIsAalesundBlocked");

describe("DriftsmeldingAalesund", () => {
    it("renders null when not affected by Aalesund municipal division", () => {
        (useIsAalesundBlocked as jest.Mock).mockReturnValue(false);
        const { container } = render(<DriftsmeldingAalesund />);
        expect(container).toMatchSnapshot();
    });

    it("renders alert when affected by Aalesund municipal division", () => {
        (useIsAalesundBlocked as jest.Mock).mockReturnValue(true);
        const { container } = render(<DriftsmeldingAalesund />);
        expect(screen.getByText(TITLE)).toBeVisible();
        expect(screen.getByText(MESSAGE)).toBeVisible();
        expect(container).toMatchSnapshot();
    });
});
