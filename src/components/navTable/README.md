# NavTable

Tabellkomponent som rendrer til standard html table kode. Kolonnebredder angis i relative enheter. 
På mobil vises bare en kolonne. CSS er skrevet med flex for å være responsiv.  

```jsx harmony
<NavTable columnWidths={[2,2,1]}>
    <NavTableHead>
        <NavTableHeadCell>
            Filnavn
        </NavTableHeadCell>
        <NavTableHeadCell>
            Beskrivelse
        </NavTableHeadCell>
        <NavTableHeadCell align="right">
            Dato lagt til
        </NavTableHeadCell>
    </NavTableHead>
    <NavTableBody>
        <NavTableRow key={1}>
            <NavTableCell>
                Innhold
            </NavTableCell>
            <NavTableCell>
                Innhold
            </NavTableCell>
            <NavTableCell align="right">
                Innhold
            </NavTableCell>
        </NavTableRow>
    </NavTableBody>
</NavTable>
```