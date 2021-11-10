import React, {useState} from "react";
import EkspanderLink from "./EkspanderLink";
import Collapsible from "react-collapsible";
import {BodyShort} from "@navikt/ds-react";

interface Props {
    tittel: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}
const UtbetalingEkspanderbart: React.FC<Props> = ({tittel, children, defaultOpen}) => {
    const [open, setOpen] = useState(defaultOpen ? defaultOpen : false);

    return (
        <>
            <div className="utbetaling_header">
                <BodyShort>{tittel}</BodyShort>
                <EkspanderLink open={open} setOpen={setOpen} />
            </div>

            <Collapsible trigger="" open={open} easing="ease-in-out">
                {children}
            </Collapsible>
        </>
    );
};

export default UtbetalingEkspanderbart;
