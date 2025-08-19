"use client";

import { Stepper } from "@navikt/ds-react/Stepper";
import { Skeleton } from "@navikt/ds-react";

import useSteps from "../useSteps";

import Step from "./Step";

const Steps = () => {
    const { steps, completed } = useSteps();

    return (
        <Stepper activeStep={completed ?? 0} interactive={false}>
            {steps}
        </Stepper>
    );
};

export const StepsSkeleton = () => (
    <Stepper activeStep={1} interactive={false}>
        <Step completed heading={<Skeleton width="400px" />}>
            <Skeleton width="200px" />
            <Skeleton width="150px" />
        </Step>
        <Step heading={<Skeleton width="400px" />}>
            <Skeleton width="200px" />
        </Step>
    </Stepper>
);

export default Steps;
