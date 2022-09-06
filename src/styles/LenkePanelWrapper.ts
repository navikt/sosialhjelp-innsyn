import styled from "styled-components";

export const StyledLenkePanelWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    gap: 1rem;
    margin-top: 2rem;

    a {
        width: 50%;
    }
    @media screen and (max-width: 746px) {
        display: flex;
        flex-direction: column;
        margin-top: 1rem;
        gap: 1rem;

        a {
            width: 100%;
        }
    }
`;
