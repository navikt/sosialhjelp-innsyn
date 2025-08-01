"use client";

import { Stepper } from "@navikt/ds-react/Stepper";
import { Skeleton } from "@navikt/ds-react";
import React from "react";

import useSteps from "./useSteps";
import Step from "./steps/Step";

const Oversikt = () => {
    const { steps, completed } = useSteps();

    return <Stepper activeStep={completed ?? 0}>{steps}</Stepper>;
};

export const OversiktSkeleton = () => (
    <Stepper activeStep={1}>
        <Step completed interactive={false} heading={<Skeleton width="400px" />}>
            <Skeleton width="200px" />
            <Skeleton width="150px" />
        </Step>
        <Step interactive={false} heading={<Skeleton width="400px" />}>
            <Skeleton width="200px" />
        </Step>
    </Stepper>
);

export default Oversikt;
