import React, {ReactNode, useEffect, useState} from "react";
import "./mainNav.less";
import Panel from "nav-frontend-paneler";
import {useIntl} from "react-intl";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Link} from "@navikt/ds-react";

interface Arkfane {
    tittel: string;
    content: ReactNode;
}

interface Props {
    arkfaner: Arkfane[];
    defaultArkfane?: number;
    className?: string;
}

const ArkfanePanel: React.FC<Props> = ({arkfaner, defaultArkfane, className}) => {
    const [valgtArkfane, setValgtArkfane] = useState(defaultArkfane ? defaultArkfane : 0);
    const intl = useIntl();
    const vedleggLabel = intl.formatMessage({id: "vedlegg.tittel"});

    useEffect(() => {
        // Logg til amplitude når "dine vedlegg" blir trykket
        if (arkfaner[valgtArkfane]?.tittel === vedleggLabel) {
            logButtonOrLinkClick("Dine vedlegg");
        }
    }, [arkfaner, valgtArkfane, vedleggLabel]);

    const velgArkfane = (event: any, index: number) => {
        setValgtArkfane(index);
        event.preventDefault();
    };

    return (
        <div className={"arkfane " + className}>
            <div className="arkfane_panel">
                <nav className="arkfane_mainNav">
                    <div className="arkfane_mainNav__wrapper">
                        <ul>
                            {arkfaner &&
                                arkfaner.map((arkfane: Arkfane, index: number) => {
                                    return (
                                        <li key={index}>
                                            <Link
                                                href="#"
                                                onClick={(event) => velgArkfane(event, index)}
                                                className={valgtArkfane === index ? "active" : "inactive"}
                                            >
                                                {arkfane.tittel}
                                            </Link>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                </nav>
            </div>
            <Panel>{arkfaner[valgtArkfane].content}</Panel>
        </div>
    );
};

export default ArkfanePanel;
