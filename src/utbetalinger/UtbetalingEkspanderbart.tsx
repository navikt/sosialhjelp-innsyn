import React, {useState} from "react";
import {Normaltekst} from "nav-frontend-typografi";
import EkspanderLink from "./EkspanderLink";
import Collapsible from "react-collapsible";

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
                <Normaltekst>{tittel}</Normaltekst>
                <EkspanderLink open={open} setOpen={setOpen} />
            </div>

            <Collapsible trigger="" open={open} easing="ease-in-out">
                {children}
            </Collapsible>
        </>
    );
};

export default UtbetalingEkspanderbart;
