import { StepperStep, StepperStepProps } from "@navikt/ds-react/Stepper";
import { Heading, VStack } from "@navikt/ds-react";
import { PropsWithChildren, ReactNode } from "react";
import cx from "classnames";

type Props = Omit<StepperStepProps, "children"> & {
    heading: ReactNode;
};

// TODO: Det kommer en ny komponent i aksel (Process) som vil erstatte dette etter hvert
const Step = ({ heading, className, children, ...rest }: PropsWithChildren<Props>) => (
    <>
        {/* @ts-expect-error StepperStep tar bare imot string som children, men det funker fint med jsx også */}
        <StepperStep interactive={false} className={cx("mb-4", className)} {...rest}>
            <VStack>
                <Heading size="small" level="4">
                    {heading}
                </Heading>
                {children}
            </VStack>
        </StepperStep>
    </>
);

export default Step;
