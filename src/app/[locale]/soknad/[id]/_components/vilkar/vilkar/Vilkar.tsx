import { BodyShort, Heading } from "@navikt/ds-react";
import { VilkarResponse } from "@generated/model";
import TaskListItem from "../../tasklistitem/TaskListItem";

interface Props {
    vilkar: VilkarResponse;
}

const Vilkar = ({ vilkar }: Props) => (
    <TaskListItem completed={false}>
        <Heading level="4" size="small" lang="no">
            {vilkar.tittel}
        </Heading>
        <BodyShort lang="no">{vilkar.beskrivelse}</BodyShort>
    </TaskListItem>
);

export default Vilkar;
