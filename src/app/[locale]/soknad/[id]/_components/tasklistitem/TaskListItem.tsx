import { Box, BoxProps } from "@navikt/ds-react";
import { forwardRef, PropsWithChildren, Ref } from "react";

interface Props {
    completed: boolean;
    // Styres av completed, men kan overrides her
    background?: BoxProps["background"];
}

const TaskListItem = ({ completed, children, background }: PropsWithChildren<Props>, ref: Ref<HTMLLIElement>) => (
    <Box
        as="li"
        ref={ref}
        background={background ?? (completed ? "neutral-soft" : "warning-soft")}
        padding={{ xs: "space-16", sm: "space-24" }}
        borderRadius="12"
        borderWidth="1"
        borderColor={completed ? "neutral-subtle" : "warning-subtle"}
    >
        {children}
    </Box>
);

export default forwardRef(TaskListItem);
