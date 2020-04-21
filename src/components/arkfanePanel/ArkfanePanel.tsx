import React, {ReactNode, useState} from "react";
import Lenke from "nav-frontend-lenker";
import "./mainNav.less";
import {Panel} from "nav-frontend-paneler";

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
                                            <Lenke
                                                href="#"
                                                onClick={(event) => velgArkfane(event, index)}
                                                className={valgtArkfane === index ? "active" : "inactive"}
                                            >
                                                {arkfane.tittel}
                                            </Lenke>
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
