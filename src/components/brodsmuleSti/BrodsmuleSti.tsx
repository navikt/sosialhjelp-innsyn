import * as React from "react";
import "./brodsmuleSti.less";
import NavFrontendChevron from "nav-frontend-chevron";
import useWindowSize from "../../utils/useWindowSize";
import {getDittNavUrl} from "../../utils/restUtils";
import Lenke from "nav-frontend-lenker";

export enum UrlType {
    ABSOLUTE_URL = "ABSOLUTE_URL",
    RELATIVE_URL = "RELATIVE_URL",
    ABSOLUTE_PATH = "ABSOLUTE_PATH",
}

export type BrodsmulestiForeldreside = {
    tittel: string;
    path: string;
    urlType?: UrlType;
};

interface Props {
    tittel: string;
    className?: string;
    foreldreside?: BrodsmulestiForeldreside;
    tilbake?: string;
    tilbakePilUrlType?: UrlType;
}

const Brodsmulesti: React.FC<Props> = ({tittel, className, foreldreside, tilbake, tilbakePilUrlType}) => {
    const {width} = useWindowSize();
    const frontpageUrl = `/`;
    let tilbakeUrl = foreldreside && foreldreside.path ? foreldreside.path : frontpageUrl;
    if (tilbake) {
        tilbakeUrl = tilbake;
    }

    let foreldresideUrl = ".";
    if (foreldreside && foreldreside.path) {
        if (foreldreside.urlType === UrlType.ABSOLUTE_PATH) {
            foreldresideUrl = foreldreside.path;
        } else {
            foreldresideUrl = "." + foreldreside.path;
        }
    }

    let crumbs: React.ReactNode = (
        <>
            <div key="tilbake" className="typo-normal breadcrumbs__item">
                <Lenke href={getDittNavUrl()} title="Gå til Ditt NAV">
                    Ditt NAV
                </Lenke>
            </div>
            {foreldreside && (
                <>
                    <div key="chevron" aria-hidden={true}>
                        <NavFrontendChevron type="høyre" />
                    </div>
                    <Lenke href={foreldresideUrl} title={foreldreside.tittel} className="breadcrumbs__parent">
                        {foreldreside.tittel}
                    </Lenke>
                </>
            )}

            <div key="chevron" aria-hidden={true}>
                <NavFrontendChevron type="høyre" />
            </div>
            <div aria-current="page" key="currentPage" className="typo-normal breadcrumbs__item breadcrumbs__current">
                {tittel}
            </div>
        </>
    );

    if (width && width < 576) {
        let tilbakePilUrl = "." + tilbakeUrl;
        if ((tilbakePilUrlType && tilbakePilUrlType === UrlType.ABSOLUTE_URL) || tilbakeUrl.match(/^http/) === null) {
            tilbakePilUrl = tilbakeUrl;
        }
        crumbs = (
            <>
                <div key="chevron" aria-hidden={true}>
                    <NavFrontendChevron type="venstre" />
                </div>
                <p className="typo-normal breadcrumbs__item">
                    <Lenke href={tilbakePilUrl} title="Gå til forrige side">
                        Tilbake
                    </Lenke>
                </p>
            </>
        );
    }

    return (
        <nav aria-label="Du er her" className={"breadcrumbs " + (className ? className : "")}>
            {crumbs}
        </nav>
    );
};

export default Brodsmulesti;
