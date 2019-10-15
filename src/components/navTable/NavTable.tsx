import React from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import 'nav-frontend-tabell-style';

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
            <table className="tabell">
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
        <th  role="columnheader" aria-sort="none" style={{width: cellWidth, textAlign: textAlign, whiteSpace: "nowrap"}}>
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
                    <thead>
                        <tr >
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
        <tbody>
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
                    <tr>
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
        <td style={{width: cellWidth, textAlign: textAlign}}>
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
