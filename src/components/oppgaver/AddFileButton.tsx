import React, {ChangeEvent} from "react";
import {FormattedMessage} from "react-intl";
import {Button} from "@navikt/ds-react";
import {Upload} from "@navikt/ds-icons";
import styled from "styled-components/macro";

const StyledUploadIcon = styled(Upload)`
    height: 1rem;
    width: 1rem;
    margin-right: 0.5rem;
`;

export const TextAndButtonWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    button {
        flex-shrink: 0;
    }

    @media screen and (max-width: 40em) {
        flex-direction: column;
    }
`;

const StyledButton = styled(Button)`
    font-weight: bold;
`;
const AddFileButton: React.FC<{
    onChange: (event: any, dokumentasjonkravReferanse: string) => void;
    referanse: string;
    id: string;
}> = ({onChange, referanse, id}) => {
    const onClick = (event?: any): void => {
        const uploadElement: any = document.getElementById("file_" + id);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    return (
        <>
            <StyledButton
                variant="tertiary"
                size="small"
                id={"oppgave_" + id + "_last_opp_fil_knapp"}
                onClick={onClick}
                icon={<StyledUploadIcon aria-hidden title="last opp" />}
            >
                <FormattedMessage id="vedlegg.velg_fil" />
            </StyledButton>
            <input
                type="file"
                id={"file_" + id}
                multiple={true}
                onChange={(event: ChangeEvent) => onChange(event, referanse)}
                style={{display: "none"}}
            />
        </>
    );
};

export default AddFileButton;
