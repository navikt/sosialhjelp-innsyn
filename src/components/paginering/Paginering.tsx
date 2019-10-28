import React from "react";
import ReactPaginate from "react-paginate";
import "./paginering.less";

interface Props {
    pageCount: number;
    initialPage?: number;
    forcePage?: number;
    onPageChange: (page: number) => void;
}

const Paginering: React.FC<Props> = ({pageCount, initialPage = 0, onPageChange, forcePage}) => {
    const handlePageClick = (value: any) => {
        onPageChange(value.selected);
    };

    return (
        <ReactPaginate
            initialPage={initialPage}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={(value: any) => handlePageClick(value)}
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            // breakClassName={'break-me'}
            containerClassName={'pagination'}
            activeClassName={'active'}
            forcePage={forcePage}
            // extraAriaContext={"Side"} // Deprecated
            // Prop 'ariaLabelBuilder' mangler i d.ts filen:
            // Erstatt 'extraAriaContext' med dette når det eventuelt kommer:
            // ariaLabelBuilder={(side: any) => {
            //     return ("Side " + side)}}
        />
    );
};

export default Paginering;
