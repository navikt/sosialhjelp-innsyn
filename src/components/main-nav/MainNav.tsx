import React from "react";
import Lenke from "nav-frontend-lenker";
import "./mainNav.less";

const MainNav: React.FC = () => (
    <nav className="mainNav">
        <div className="mainNav__wrapper">
            <ul>
                <li>
                    <Lenke href="/todo" className="inactive">
                        Utførte utbetalinger
                    </Lenke>
                </li>
                <li>
                    <Lenke href="/todo2" className="active">
                        Kommende utbetalinger
                    </Lenke>
                </li>
            </ul>
        </div>
    </nav>
);

export default MainNav;
