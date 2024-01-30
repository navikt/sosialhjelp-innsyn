import React, {useState} from "react";
import {Pagination} from "@navikt/ds-react";

interface Props {
    pageCount: number;
    page: number;
    onPageChange: (page: number) => void;
}

const Paginering: React.FC<Props> = ({pageCount, page, onPageChange}) => {
    return (
        <Pagination
            page={page}
            count={pageCount}
            onPageChange={onPageChange}
            boundaryCount={2}
            siblingCount={3}
            // initialPage={initialPage}
            // pageCount={pageCount}
            // marginPagesDisplayed={2}
            // pageRangeDisplayed={3}
            // disableInitialCallback={true}
            // onPageChange={(value: any) => handlePageClick(value)}
            // previousLabel={"<"}
            // nextLabel={">"}
            // breakLabel={"..."}
            // breakClassName={'break-me'}
            // containerClassName={"pagination"}
            // activeClassName={"active"}
            // forcePage={forcePage}
            // hrefBuilder={(value: any) => buildHref(value)}
            // extraAriaContext={"Side"} // Deprecated
            // Prop 'ariaLabelBuilder' mangler i d.ts filen:
            // Erstatt 'extraAriaContext' med dette når det eventuelt kommer:
            // ariaLabelBuilder={(side: any) => {
            //     return ("Side " + side)}}
        />
    );
};

export default Paginering;
