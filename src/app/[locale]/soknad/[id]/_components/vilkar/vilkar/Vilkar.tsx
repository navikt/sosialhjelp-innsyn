import { BodyShort, Heading, VStack } from "@navikt/ds-react";
import { VilkarResponse } from "@generated/model";
import TaskListItem from "../../tasklistitem/TaskListItem";

interface Props {
    vilkar: VilkarResponse;
}

const Vilkar = ({ vilkar }: Props) => (
    <TaskListItem variant="warning">
        <VStack gap="space-6">
            <Heading level="3" size="small" lang="no" data-color="warning">
                {vilkar.tittel}
            </Heading>
            <BodyShort lang="no" data-color="warning">
                {vilkar.beskrivelse}
            </BodyShort>
        </VStack>
    </TaskListItem>
);

export default Vilkar;
