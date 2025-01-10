import React, {ChangeEvent} from "react";
import {useTranslation} from "next-i18next";
import {Button} from "@navikt/ds-react";

interface Props {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    id: string;
    resetStatus: () => void;
    hasError?: boolean;
    disabled?: boolean;
    title?: string;
}

const AddFileButton: React.FC<Props> = ({onChange, id, resetStatus, hasError, disabled, title}) => {
    const {t} = useTranslation();

    const onClick = (event?: React.MouseEvent<HTMLButtonElement>): void => {
        resetStatus();
        const uploadElement = document.getElementById("file_" + id);
        uploadElement?.click();
        event?.preventDefault();
    };
    const resetInputValue = (event: React.MouseEvent<HTMLInputElement>) => {
        event.currentTarget.value = "";
    };

    return (
        <>
            <Button variant="secondary" size="small" onClick={onClick} disabled={disabled}>
                <span aria-hidden>{`+ `}</span> {t("vedlegg.velg_fil")}
            </Button>
            <label className="navds-sr-only" htmlFor={"file_" + id}>
                {`${t("vedlegg.velg_fil")} ${title}`}
            </label>
            <input
                type="file"
                id={"file_" + id}
                multiple={true}
                onChange={onChange}
                onClick={resetInputValue}
                className="navds-sr-only"
                tabIndex={-1}
                accept="image/jpeg,image/png,application/pdf,impage/jpg"
                aria-invalid={hasError}
            />
        </>
    );
};

export default AddFileButton;
