import React, { useState } from "react";
import { Box, Button, Pagination, VStack } from "@navikt/ds-react";
import { chunk, take } from "remeda";

import styles from "../../styles/lists.module.css";

interface Props {
    children: React.JSX.Element[];
    countPerPage: number;
    variant?: "paginert" | "last_flere";
}

const PaginertListe = ({ children, countPerPage, variant = "paginert" }: Props): React.JSX.Element => {
    const [currentPage, setCurrentPage] = useState(1);

    const pageCount = Math.ceil(children.length / countPerPage);
    const currentChunk =
        variant === "paginert"
            ? chunk(children, countPerPage)[currentPage - 1]
            : take(children, countPerPage * currentPage);
    return (
        <>
            <ul className={styles.unorderedList}>{currentChunk}</ul>
            <VStack align="center" justify="center">
                <Box padding="4">
                    {variant === "paginert" && children.length > countPerPage && (
                        <Pagination
                            page={currentPage}
                            count={pageCount}
                            onPageChange={setCurrentPage}
                            siblingCount={1}
                            boundaryCount={1}
                        />
                    )}
                    {variant === "last_flere" && currentPage < pageCount && (
                        <Button variant="tertiary" onClick={() => setCurrentPage((prev) => prev + 1)}>
                            Last inn flere
                        </Button>
                    )}
                </Box>
            </VStack>
        </>
    );
};

export default PaginertListe;
