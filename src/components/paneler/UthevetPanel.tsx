import styled from "styled-components";
import {Panel} from "@navikt/ds-react";

export const UthevetPanel = styled(Panel)`
    border-radius: 8px;
    border: solid 4px #9bd0b0;

    @media screen and (min-width: 641px) {
        padding-top: 2rem;

        .panel-uthevet-luft-under {
            padding-bottom: 4rem;
        }
    }

    @media screen and (max-width: 640px) {
        padding-top: 1rem;

        .panel-uthevet-luft-under {
            padding-bottom: 1rem;
        }
    }
`;

export const UthevetPanelEkstraPadding = styled(UthevetPanel)`
    margin-top: 1rem;
    @media screen and (min-width: 641px) {
        padding: 2rem 80px 2rem 80px;
    }
`;
