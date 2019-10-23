import React from "react";
import Lenke from "nav-frontend-lenker";
import {NedChevron, OppChevron} from "nav-frontend-chevron";

const EkspanderLink: React.FC<{ open: boolean, setOpen: (open: boolean) => void }> = ({open, setOpen}) => {
    return (
        <span>
            {open && (
                <Lenke href="#" onClick={(evt: any) => {
                    setOpen(false);
                    evt.preventDefault();
                }}>
                    Lukk
                    <OppChevron/>
                </Lenke>
            )}
            {!open && (
                <Lenke href="#" onClick={(evt: any) => {
                    setOpen(true);
                    evt.preventDefault()
                }}>
                    Mer informasjon
                    <NedChevron/>
                </Lenke>
            )}
                </span>
    );
};

export default EkspanderLink;
