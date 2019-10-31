import React, {useState} from "react";
import {Normaltekst} from "nav-frontend-typografi";
import EkspanderLink from "./EkspanderLink";
import Collapsible from "react-collapsible";

const UtbetalingEkspanderbart: React.FC<{ tittel: string, children: React.ReactNode }> = ({tittel, children}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="utbetaling_header">
                <Normaltekst>
                    {tittel}
                </Normaltekst>
                <EkspanderLink open={open} setOpen={setOpen}/>
            </div>

            <Collapsible trigger="" open={open} easing="ease-in-out">
                {children}
            </Collapsible>
        </>
    );
};

export default UtbetalingEkspanderbart;
