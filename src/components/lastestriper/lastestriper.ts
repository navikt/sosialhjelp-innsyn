import styled from "styled-components/macro";

const lasterstriperMork = "#ddd9d6";
const lasterstriperLys = "#e9e7e7";

export const StyledLastestriper = styled.div`
    display: block;
    width: 100%;

    .lastestripe {
        display: block;
        height: 18px;
        border-radius: 2px;
        margin-bottom: 8px;
        background-color: ${lasterstriperMork};
        webkit-animation-name: animasjon; /* Safari 4.0 - 8.0 */
        -webkit-animation-duration: 1200ms; /* Safari 4.0 - 8.0 */
        -webkit-animation-timing-function: ease-in-out;
        animation-name: animasjon;
        animation-duration: 1200ms;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;

        &__smal {
            width: 55%;
        }

        &__kort_forsinkelse {
            -webkit-animation-delay: 300ms;
            animation-delay: 300ms;
        }

        &__lang_forsinkelse {
            -webkit-animation-delay: 600ms;
            animation-delay: 600ms;
        }
    }

    /* Safari 4.0 - 8.0 */
    @-webkit-keyframes animasjon {
        0%,
        100% {
            background-color: ${lasterstriperMork};
        }
        50% {
            background-color: ${lasterstriperLys};
        }
    }

    /* Standard syntax */
    @keyframes animasjon {
        0%,
        100% {
            background-color: ${lasterstriperMork};
        }
        50% {
            background-color: ${lasterstriperLys};
        }
    }
`;
