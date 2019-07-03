import React from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import "./navTable.less";

interface NavTableContextInterface {
    columnWidths: number[];
}

const NavTableContext = React.createContext<NavTableContextInterface>({columnWidths: []});

interface NavTableProps {
    columnWidths: number[];
    children: any;
}

const NavTable: React.FC<NavTableProps> = ({columnWidths, children}) => {
    const navTableContext: NavTableContextInterface = {
        columnWidths
    };
    return (
        <NavTableContext.Provider value={navTableContext}>
            <table className="nav_table">
                {children}
            </table>
        </NavTableContext.Provider>
    );
};

const NavTableContextConsumer = NavTableContext.Consumer;

interface NavTableCellProps {
    children: any;
    align?: string;
    width?: string;
}

const NavTableHeadCell: React.FC<NavTableCellProps> = ({children, align, width}) => {
    const textAlign = align && align === "right" ? "right" : "left";
    const cellWidth = (width ? width : "40%");
    return (
        <th className="nav_table_head_cell" style={{width: cellWidth, textAlign: textAlign}}>
            <Element>
                {children}
            </Element>
        </th>
    );
};

const adjustChildrenWidths = (navTableContext: NavTableContextInterface, children: any): React.ReactNode[] =>{
    const sum: number = navTableContext.columnWidths.reduce((a: number, b: number) => a + b);
    const columnWidthsInPercent: number[] = navTableContext.columnWidths.map((item: number) => {
        return (item / sum) * 100
    });
    let index: number = -1;
    const widthAdjustedChildren = React.Children.map(children, (tableHeadCell: any) => {
        index = index + 1;
        return React.cloneElement(tableHeadCell, {
            width: columnWidthsInPercent[index] + "%"
        });
    });
    return widthAdjustedChildren;
};

const NavTableHead: React.FC<{children: React.ReactNode[]}> = ({children}) => {
    return (
        <NavTableContextConsumer>
            { (navTableContext: NavTableContextInterface) => {
                const widthAdjustedChildren = adjustChildrenWidths(navTableContext, children);
                return (
                    <thead className="nav_table_head">
                    <tr className="nav_table_head_row" >
                        {widthAdjustedChildren}
                    </tr>
                    </thead>
                );
            } }
        </NavTableContextConsumer>
    );
};

const NavTableBody: React.FC<{children: any}> = ({children}) => {
    return (
        <tbody className="nav_table_body">
        {children}
        </tbody>
    );
};

const NavTableRow: React.FC<{children: any}> = ({children}) => {
    return (
        <NavTableContextConsumer>
            { (navTableContext: NavTableContextInterface) => {
                const widthAdjustedChildren = adjustChildrenWidths(navTableContext, children);
                return (
                    <tr className="nav_table_row">
                        {widthAdjustedChildren}
                    </tr>
                );
            } }
        </NavTableContextConsumer>
    );
};

const NavTableCell: React.FC<NavTableCellProps> = ({children, align, width}) => {
    const textAlign = align && align === "right" ? "right" : "left";
    const cellWidth = (width ? width : "40%");
    return (
        <td className="nav_table_cell" style={{width: cellWidth, textAlign: textAlign}}>
            <Normaltekst>
                {children}
            </Normaltekst>
        </td>
    );
};

export {
    NavTable,
    NavTableHead,
    NavTableHeadCell,
    NavTableBody,
    NavTableRow,
    NavTableCell
};
