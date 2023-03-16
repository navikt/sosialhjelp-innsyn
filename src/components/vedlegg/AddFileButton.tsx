import React, {ChangeEvent} from "react";
import {useTranslation} from "react-i18next";
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
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    id: string;
    resetErrors: () => void;
}> = ({onChange, id, resetErrors}) => {
    const {t} = useTranslation();

    const onClick = (event?: any): void => {
        resetErrors();
        const uploadElement: any = document.getElementById("file_" + id);
        uploadElement.click();
        event?.preventDefault();
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
                {t("vedlegg.velg_fil")}
            </StyledButton>
            <label className={`navds-sr-only`} htmlFor={"file_" + id}>
                {t("vedlegg.velg_fil")}
            </label>
            <input
                type="file"
                id={"file_" + id}
                multiple={true}
                onChange={onChange}
                className="navds-sr-only"
                tabIndex={-1}
            />
        </>
    );
};

export default AddFileButton;
