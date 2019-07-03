# NavTable

Responsiv og semantisk tabell. Rendrer standard html table. Kolonnebredder kan angis i relative enheter.  

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