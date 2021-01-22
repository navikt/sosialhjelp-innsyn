import React from "react";
import {Normaltekst} from "nav-frontend-typografi";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";

interface Props {
    tittel: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}
const UtbetalingEkspanderbart: React.FC<Props> = ({tittel, children, defaultOpen}) => {
    return (
        <Ekspanderbartpanel
            apen={defaultOpen}
            border={false}
            tittel={
                <div className="utbetaling_header">
                    <Normaltekst>{tittel}</Normaltekst>
                </div>
            }
        >
            {children}
        </Ekspanderbartpanel>
    );
};

export default UtbetalingEkspanderbart;
