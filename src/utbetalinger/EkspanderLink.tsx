import React from "react";
import {Link} from "@navikt/ds-react";
import {Collapse, Expand} from "@navikt/ds-icons";

const EkspanderLink: React.FC<{open: boolean; setOpen: (open: boolean) => void}> = ({open, setOpen}) => {
    return (
        <span>
            {open && (
                <Link
                    href="#"
                    onClick={(evt: any) => {
                        setOpen(false);
                        evt.preventDefault();
                    }}
                >
                    Lukk
                    <Collapse />
                </Link>
            )}
            {!open && (
                <Link
                    href="#"
                    onClick={(evt: any) => {
                        setOpen(true);
                        evt.preventDefault();
                    }}
                >
                    Mer informasjon
                    <Expand />
                </Link>
            )}
        </span>
    );
};

export default EkspanderLink;
