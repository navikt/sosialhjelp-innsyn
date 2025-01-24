import * as React from "react";
import { Alert } from "@navikt/ds-react";
import cx from "classnames";

export const DriftsmeldingAlert = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <Alert variant="error" size="medium" inline className={cx("font-bold", className)}>
        {children}
    </Alert>
);
