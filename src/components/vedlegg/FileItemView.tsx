import React, {useState} from "react";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {formatBytes} from "../../utils/formatting";
import VedleggModal from "./VedleggModal";
import {REST_STATUS} from "../../utils/restUtils";
import {BodyShort, Button, Link} from "@navikt/ds-react";
import {ErrorMessage} from "../errors/ErrorMessage";
import styled from "styled-components/macro";
import {Delete} from "@navikt/ds-icons";
import styles from "../../styles/lists.module.css";
import {useTranslation} from "react-i18next";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const MOBILE_MAXWIDTH = "40em";
const StyledErrorMessage = styled(ErrorMessage)`
    margin: 0.5rem 0 0.5rem;

    @media screen and (max-width: ${MOBILE_MAXWIDTH}) {
        margin: 0.5rem 0;
    }
`;

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
    filer: Fil[];
    onDelete: (event: any, fil: Fil) => void;
}

const FileItemView = (props: Props) => {
    const [modalVises, setModalVises] = useState(false);
    const {t} = useTranslation();

    if (!props.filer || props.filer?.length === 0) {
        return null;
    }

    const onVisVedlegg = (event: ClickEvent): void => {
        setModalVises(true);
        event.preventDefault();
    };

    console.log(props.filer);
    return (
        <ul className={styles.unorderedList}>
            {props.filer.map((fil: Fil, index) => (
                <StyledLiTag key={fil.id}>
                    <StyledFilInfoOgKnapp>
                        <StyledFilInfo>
                            {fil.file && (
                                <VedleggModal
                                    file={fil.file}
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

                                    {fil.filnavn}
                                </Link>
                            </>
                            <BodyShort as="span" className="filstorrelse">
                                ({formatBytes(fil.file ? fil.file.size : 0)})
                            </BodyShort>
                        </StyledFilInfo>
                        <StyledDeleteButton
                            variant="tertiary"
                            size="small"
                            onClick={(event: any) => props.onDelete(event, fil)}
                            iconPosition="right"
                            icon={<Delete aria-hidden title="fjern" />}
                        >
                            {t("vedlegg.fjern")}
                        </StyledDeleteButton>
                    </StyledFilInfoOgKnapp>
                    {fil.status !== REST_STATUS.INITIALISERT &&
                        fil.status !== REST_STATUS.PENDING &&
                        fil.status !== REST_STATUS.OK && (
                            <StyledErrorMessage>
                                {t(
                                    "vedlegg.opplasting_feilmelding_" + fil.status,
                                    "Vi klarte dessverre ikke lese filen din. Årsaken er ukjent."
                                )}
                            </StyledErrorMessage>
                        )}
                </StyledLiTag>
            ))}
        </ul>
    );
};

export default FileItemView;
