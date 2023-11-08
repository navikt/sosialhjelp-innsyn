import styled from "styled-components";
import {Heading, Panel as DsPanel} from "@navikt/ds-react";
import React from "react";
import {useTranslation} from "next-i18next";

const StyledPanel = styled(DsPanel)<{$error?: boolean}>`
    position: relative;
    border-color: ${(props) => (props.$error ? "var(--a-red-500)" : "transparent")};
    @media screen and (min-width: 641px) {
        padding: 2rem 4.25rem;
        margin-top: 1.5rem;
    }
    @media screen and (max-width: 640px) {
        padding: 1rem;
        margin-top: 1.5rem;
    }
`;

const StyledHeading = styled(Heading)<{$harOppgaver?: boolean}>`
    //border-bottom: 1px solid black;
    border-bottom: 2px solid var(${(props) => (props.$erOppgaver ? "--a-transparent" : "--a-red-300")});
    padding-bottom: 5px;
`;

interface Props {
    hasError?: boolean;
    harOppgaver?: boolean;
    header?: React.ReactNode | string;
    children: React.ReactNode;
}

/*        {header && typeof header === "string"
            ?
            headinger(header, harOppgaver)
            :
            header
        }
        */
const headinger = (header: string, harOppgaver: boolean): React.JSX.Element => {
    console.log("harOppgaver", harOppgaver);
    const {t} = useTranslation();
    return (
        <>
            {header && typeof header === t("oppgaver.dine_oppgaver") ? (
                <StyledHeading level="2" size="medium" harOppgaver={harOppgaver}>
                    {header}
                </StyledHeading>
            ) : (
                <StyledHeading level="2" size="medium" harOppgaver={false}>
                    {header}
                </StyledHeading>
            )}
        </>
    );
};

const Panel = ({hasError, harOppgaver, header, children}: Props): React.JSX.Element => (
    <StyledPanel $error={hasError}>
        {header && typeof header === "string" ? headinger(header, harOppgaver) : header}
        {children}
    </StyledPanel>
);

export default Panel;
