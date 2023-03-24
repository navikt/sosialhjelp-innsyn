import React, {ReactElement} from "react";
import ErrorMessagePlaceholder, {ErrorMessage} from "../errors/ErrorMessage";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import {css} from "styled-components/macro";
import FileItemView from "./FileItemView";
import ErrorMessagesSummary, {dedupeErrorsByProp} from "./ErrorMessagesSummary";
import {Error, errorStatusToMessage} from "./useFilOpplasting";
import styles from "./filopplasting.module.css";

const StyledFrame = styled.div<{hasError?: boolean}>`
    padding: 1rem;
    background-color: var(--a-gray-50);
    border-radius: 4px;

    ${({hasError}) =>
        hasError &&
        css`
            background-color: var(--a-red-50);
            border: 1px solid var(--a-red-500);
        `};
`;

interface Props {
    innsendelsesFrist?: React.ReactElement;
    addFileButton?: React.ReactElement;
    hasInnerErrors: boolean;
    filer: File[];
    onDelete: (event: React.MouseEvent<HTMLButtonElement>, fil: File) => void;
    errors: Error[];
}

const FilOpplastingBlokk = (props: Props): ReactElement => {
    const {innsendelsesFrist, addFileButton} = props;
    const uniqueErrors = dedupeErrorsByProp(props.errors, "feil");
    const {t} = useTranslation();

    return (
        <StyledFrame hasError={props.hasInnerErrors}>
            {innsendelsesFrist}

            {addFileButton}
            <ErrorMessagePlaceholder>
                {props.errors && props.errors?.length > 0 ? (
                    <>
                        <ErrorMessagesSummary errors={props.errors} />
                        <ul className={styles.feilListe}>
                            {uniqueErrors.map((key, i) => (
                                <li key={i}>
                                    <ErrorMessage>{t(errorStatusToMessage[key.feil])}</ErrorMessage>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <></>
                )}
            </ErrorMessagePlaceholder>
            <FileItemView errors={props.errors} filer={props.filer} onDelete={props.onDelete} />
        </StyledFrame>
    );
};

export default FilOpplastingBlokk;
