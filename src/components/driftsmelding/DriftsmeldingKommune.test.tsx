import React from "react";
import { vi, expect, describe, it, beforeAll, afterAll } from "vitest";

import { render } from "../../test/test-utils";

import { DriftsmeldingKommune } from "./DriftsmeldingKommune";
import { KommuneDriftsmeldingError } from "./lib/getDriftsmeldingFromKommune";

describe("DriftsmeldingKommune", () => {
    beforeAll(() => vi.useFakeTimers({ now: new Date("1987-11-09T12:00:00Z") }));

    afterAll(() => vi.useRealTimers());

    const renderDriftsmeldingKommune = (driftsmelding: KommuneDriftsmeldingError | undefined) =>
        render(<DriftsmeldingKommune driftsmelding={driftsmelding} />).asFragment();

    it("renders nothing if driftsmelding is undefined", () =>
        expect(renderDriftsmeldingKommune(undefined)).toMatchSnapshot());

    it("renders error alert with mldInnsynOgEttersendelseDeaktivert", () =>
        expect(renderDriftsmeldingKommune("driftsmelding.innsynOgEttersendelseDeaktivert")).toMatchSnapshot());

    it("renders error alert with mldEttersendelseDeaktivert", () =>
        expect(renderDriftsmeldingKommune("driftsmelding.ettersendelseDeaktivert")).toMatchSnapshot());

    it("renders error alert with mldInnsynDeaktivert", () =>
        expect(renderDriftsmeldingKommune("driftsmelding.innsynDeaktivert")).toMatchSnapshot());
});
