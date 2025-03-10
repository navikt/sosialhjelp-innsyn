import { Loader } from "@navikt/ds-react";
import * as React from "react";

export const ApplicationSpinner = () => (
    <div className="w-full text-center pt-[100px]">
        <Loader size="2xlarge" />
    </div>
);
