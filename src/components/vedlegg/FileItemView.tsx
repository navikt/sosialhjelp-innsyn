import React, {useState} from "react";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import {formatBytes} from "../../utils/formatting";
import VedleggModal from "./VedleggModal";
import {BodyShort, Button, Link} from "@navikt/ds-react";
import styled from "styled-components/macro";
import {Delete} from "@navikt/ds-icons";
import {v4 as uuidv4} from "uuid";
import styles from "../../styles/lists.module.css";
import {useTranslation} from "react-i18next";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const MOBILE_MAXWIDTH = "40em";

const StyledLiTag = styled.li`
    margin: 1rem 0;
    max-width: 100%;
    min-height: 38px;
    padding-bottom: 1px;
    border-bottom: 1px solid #c6c2bf;
`;

const StyledFilInfoOgKnapp = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const StyledFilInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    white-space: nowrap;
    flex-wrap: wrap;

    .filikon {
        height: 20px;
        width: 20px;
        margin-right: 8px;
        margin-bottom: -2px;
    }

    a.filnavn {
        display: inline;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 20rem;
    }
`;

const StyledDeleteButton = styled(Button)`
    white-space: nowrap;
    margin-left: auto;
    font-weight: bold;
    @media screen and (max-width: ${MOBILE_MAXWIDTH}) {
        svg {
            display: none;
        }
    }
`;

interface Props {
    filer: File[];
    onDelete: (event: React.MouseEvent<HTMLButtonElement>, fil: File) => void;
}

const FileItemView = (props: Props) => {
    const [modalVises, setModalVises] = useState(false);
    const {t} = useTranslation();

    if (props.filer.length === 0) {
        return null;
    }

    const onVisVedlegg = (event: ClickEvent): void => {
        setModalVises(true);
        event.preventDefault();
    };

    return (
        <ul className={styles.unorderedList}>
            {props.filer.map((fil: File) => (
                <StyledLiTag key={uuidv4()}>
                    <StyledFilInfoOgKnapp>
                        <StyledFilInfo>
                            {fil && (
                                <VedleggModal
                                    file={fil}
                                    onRequestClose={() => setModalVises(false)}
                                    synlig={modalVises}
                                />
                            )}
                            <>
                                <Link
                                    href="#"
                                    className="filnavn"
                                    onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                                        onVisVedlegg(event)
                                    }
                                >
                                    <PaperClipSlanted className="filikon" />

                                    {fil.name}
                                </Link>
                            </>
                            <BodyShort as="span" className="filstorrelse">
                                ({formatBytes(fil ? fil.size : 0)})
                            </BodyShort>
                        </StyledFilInfo>
                        <StyledDeleteButton
                            variant="tertiary"
                            size="small"
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => props.onDelete(event, fil)}
                            iconPosition="right"
                            icon={<Delete aria-hidden title="fjern" />}
                        >
                            {t("vedlegg.fjern")}
                        </StyledDeleteButton>
                    </StyledFilInfoOgKnapp>
                </StyledLiTag>
            ))}
        </ul>
    );
};

export default FileItemView;
