import { Alert, AlertProps } from "@navikt/ds-react";
import { ReactNode, forwardRef } from "react";

interface AccessibleAlertProps extends AlertProps {
    children: React.ReactNode;
}

/**
 * Wrapper around NAV Alert component that adds proper ARIA live region attributes
 * for screen reader announcements.
 *
 * - Success alerts use aria-live="polite" to announce without interrupting
 * - Error alerts use aria-live="assertive" to announce immediately
 */
const AccessibleAlert = ({ variant, children, ...props }: AccessibleAlertProps) => {
    const isError = variant === "error" || variant === "warning";
    const ariaLive = isError ? "assertive" : "polite";

    return (
        <Alert variant={variant} aria-live={ariaLive} aria-atomic="true" {...props}>
            {children}
        </Alert>
    );
};

/**
 * Persistent live region container that stays in the DOM to ensure screen reader announcements work
 * even when other DOM elements are being added/removed.
 * Uses only aria-live without role to avoid "leaving main content" announcements.
 * Can receive focus to prevent focus loss when other elements are removed from DOM.
 */
export const LiveRegion = forwardRef<
    HTMLDivElement,
    { children: ReactNode; variant?: "success" | "error" | "warning" | "info" }
>(({ children, variant = "success" }, ref) => {
    const isError = variant === "error" || variant === "warning";
    const ariaLive = isError ? "assertive" : "polite";

    return (
        <div ref={ref} tabIndex={-1} aria-live={ariaLive} aria-atomic="true" className="focus:outline-none">
            {children}
        </div>
    );
});

LiveRegion.displayName = "LiveRegion";

export default AccessibleAlert;
