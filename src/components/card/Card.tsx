import { HStack } from "@navikt/ds-react";
import {
    ExpansionCard,
    ExpansionCardHeader,
    ExpansionCardDescription,
    ExpansionCardTitle,
} from "@navikt/ds-react/ExpansionCard";
import { ReactNode } from "react";
import { useRouter } from "../../i18n/navigation";

interface Props {
    title: string;
    href: string;
    icon?: ReactNode;
    description?: string;
}

// Fram til det lages en erstatning for LinkPanel, så bruker vi denne
const Card = ({ icon, title, description, href }: Props) => {
    const router = useRouter();
    return (
        <ExpansionCard aria-label="Demo med ikon" open={false} onToggle={() => router.push(href)}>
            <ExpansionCardHeader>
                <HStack wrap={false} gap="4" align="center">
                    <div>{icon}</div>
                    <div>
                        <ExpansionCardTitle>{title}</ExpansionCardTitle>
                        <ExpansionCardDescription>{description} </ExpansionCardDescription>
                    </div>
                </HStack>
            </ExpansionCardHeader>
        </ExpansionCard>
    );
};

export default Card;
