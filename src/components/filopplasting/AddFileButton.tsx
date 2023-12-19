import React, {ChangeEvent} from "react";
import {useTranslation} from "next-i18next";
import {Button} from "@navikt/ds-react";

const AddFileButton: React.FC<{
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    id: string;
    resetStatus: () => void;
    disabled?: boolean;
}> = ({onChange, id, resetStatus, disabled}) => {
    const {t} = useTranslation();

    const onClick = (event?: any): void => {
        resetStatus();
        const uploadElement: any = document.getElementById("file_" + id);
        uploadElement.click();
        event?.preventDefault();
    };
    const resetInputValue = (event: any) => {
        event.target.value = "";
    };

    return (
        <>
            <Button variant="secondary" size="small" onClick={onClick} disabled={disabled}>
                <span aria-hidden>{`+ `}</span> {t("vedlegg.velg_fil")}
            </Button>
            <label className={`navds-sr-only`} htmlFor={"file_" + id}>
                {t("vedlegg.velg_fil")}
            </label>
            <input
                type="file"
                id={"file_" + id}
                multiple={true}
                onChange={onChange}
                onClick={(event) => resetInputValue(event)}
                className="navds-sr-only"
                tabIndex={-1}
                accept="image/jpeg,image/png,application/pdf,impage/jpg"
            />
        </>
    );
};

export default AddFileButton;
