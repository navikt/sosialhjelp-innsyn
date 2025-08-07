import { StepperStep, StepperStepProps } from "@navikt/ds-react/Stepper";
import { Heading, VStack, Box } from "@navikt/ds-react";
import { PropsWithChildren, ReactNode } from "react";
import cx from "classnames";

type Props = Omit<StepperStepProps, "children"> & {
    heading: ReactNode;
};

// TODO: Det kommer en ny komponent i aksel (Process) som vil erstatte dette etter hvert
const Step = ({ heading, className, children, ...rest }: PropsWithChildren<Props>) => (
    <>
        {/* @ts-expect-error StepperStep tar bare imot string som children, men det funker fint med jsx også */}
        <StepperStep className={cx("mb-4 text-ax-text-info", className)} {...rest}>
            <VStack>
                <Heading size="small" level="4" className="font-ax-bold">
                    {heading}
                </Heading>
                <Box className="font-ax-regular">{children}</Box>
            </VStack>
        </StepperStep>
    </>
);

export default Step;
