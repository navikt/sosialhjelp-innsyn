import React from "react";
import "./mainNav.less";
import {Link} from "@navikt/ds-react";

const MainNav: React.FC = () => (
    <nav className="mainNav">
        <div className="mainNav__wrapper">
            <ul>
                <li>
                    <Link href="/todo" className="inactive">
                        Utførte utbetalinger
                    </Link>
                </li>
                <li>
                    <Link href="/todo2" className="active">
                        Kommende utbetalinger
                    </Link>
                </li>
            </ul>
        </div>
    </nav>
);

export default MainNav;
