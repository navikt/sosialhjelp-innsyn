import React, {useState} from "react";
import Collapsible from "react-collapsible";
import {BodyShort, Button} from "@navikt/ds-react";
import styled from "styled-components";
import {Collapse, Expand} from "@navikt/ds-icons";

interface Props {
    tittel: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const StyledExpanderbarHeader = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;

    button {
        padding: var(--a-spacing-2) var(--a-spacing-4);
    }

    @media only screen and (max-width: 480px) {
        gap: 0.5rem;
        flex-direction: column;
        align-items: flex-start;
        button {
            align-self: flex-end;
        }
    }
`;
const UtbetalingEkspanderbart: React.FC<Props> = ({tittel, children, defaultOpen}) => {
    const [open, setOpen] = useState(defaultOpen ? defaultOpen : false);

    return (
        <>
            <StyledExpanderbarHeader>
                <BodyShort>{tittel}</BodyShort>
                <Button
                    variant="tertiary"
                    onClick={(evt: any) => {
                        setOpen(!open);
                        evt.preventDefault();
                    }}
                    icon={open ? <Collapse aria-hidden title="Lukk" /> : <Expand aria-hidden title="Mer informasjon" />}
                    iconPosition="right"
                >
                    {open ? "Lukk" : "Mer informasjon"}
                </Button>
            </StyledExpanderbarHeader>

            <Collapsible trigger="" open={open} easing="ease-in-out">
                {children}
            </Collapsible>
        </>
    );
};

export default UtbetalingEkspanderbart;
