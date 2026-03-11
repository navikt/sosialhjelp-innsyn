import { BodyShort, Heading } from "@navikt/ds-react";
import { VilkarResponse } from "@generated/model";
import TaskListItem from "../../tasklistitem/TaskListItem";

interface Props {
    vilkar: VilkarResponse;
}

const Vilkar = ({ vilkar }: Props) => (
    <TaskListItem completed={false}>
        <Heading level="4" size="small" lang="no" data-color="warning">
            {vilkar.tittel}
        </Heading>
        <BodyShort lang="no" data-color="warning">
            {vilkar.beskrivelse}
        </BodyShort>
    </TaskListItem>
);

export default Vilkar;
