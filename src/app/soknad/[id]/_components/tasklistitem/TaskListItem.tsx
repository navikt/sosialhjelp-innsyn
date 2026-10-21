import { Box } from "@navikt/ds-react";
import { forwardRef, PropsWithChildren, Ref } from "react";

interface Props {
    variant: "normal" | "warning";
}

const TaskListItem = ({ children, variant = "normal" }: PropsWithChildren<Props>, ref: Ref<HTMLLIElement>) => (
    <Box
        as="li"
        ref={ref}
        background={variant === "normal" ? "neutral-soft" : "warning-soft"}
        padding={{ xs: "space-16", sm: "space-24" }}
        borderRadius="12"
        borderWidth="1"
        borderColor={variant === "normal" ? "neutral-subtle" : "warning-subtle"}
    >
        {children}
    </Box>
);

export default forwardRef(TaskListItem);
