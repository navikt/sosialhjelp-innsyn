import styled from "styled-components";

export const TittelOgIkon = styled.div`
    display: flex;
    align-items: center;

    @media screen and (min-width: 641px) {
        flex-direction: row;
        justify-content: space-between;
        padding: 0 80px 2rem 80px;
    }

    @media screen and (max-width: 640px) {
        flex-direction: column-reverse;
        margin-bottom: 1rem;
    }
`;
