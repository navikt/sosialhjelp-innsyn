import React from "react";
import {NedChevron, OppChevron} from "nav-frontend-chevron";
import {Link} from "@navikt/ds-react";

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
                    <OppChevron />
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
                    <NedChevron />
                </Link>
            )}
        </span>
    );
};

export default EkspanderLink;
