import styled from "styled-components";

export const TittelOgIkon = styled.div`
    display: flex;
    align-items: center;

    @media screen and (min-width: 641px) {
        flex-direction: row;
        justify-content: space-between;
    }

    @media screen and (max-width: 640px) {
        flex-direction: column-reverse;
        margin-bottom: 1rem;
    }
`;
