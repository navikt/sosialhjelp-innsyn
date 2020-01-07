import * as React from "react";
import "./brodsmulesti.less";
import NavFrontendChevron from 'nav-frontend-chevron';
import {onClickBackLink} from "../../utils/navigasjon";
import useWindowSize from "../../utils/useWindowSize";

export enum UrlType {
    HISTORY_BACK = "HISTORY_BACK",
    ABSOLUTE_URL = "ABSOLUTE_URL",
    RELATIVE_URL = "RELATIVE_URL"
}

export type BrodsmulestiForeldreside = {
    tittel: string;
    path: string;
    urlType?: UrlType;
}

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

    const onClickTilbakePil = (event: any): void => {
        if (tilbakePilUrlType) {
          if (tilbakePilUrlType === UrlType.ABSOLUTE_URL) {
              window.location.href = tilbakeUrl;
          }
          if (tilbakePilUrlType === UrlType.HISTORY_BACK) {
              onClickBackLink(event);
          }
        }
    };

    const onClickForeldreLink = (event: any): void => {
        if (foreldreside && foreldreside.urlType) {
            if (foreldreside.urlType === UrlType.HISTORY_BACK) {
                onClickBackLink(event);
            }

        } else {
            if (foreldreside && foreldreside.path) {
                window.location.href = foreldreside.path;
            }
        }
    };

    let foreldresideUrl = ".";
    if (foreldreside && foreldreside.path) {
        if (foreldreside.urlType === UrlType.HISTORY_BACK) {
            foreldresideUrl = foreldreside.path;
        } else {
            foreldresideUrl = "." + foreldreside.path;
        }
    }

    let crumbs: React.ReactNode = (
        <>
            <div key="tilbake" className="typo-normal breadcrumbs__item">
                <a href="https://tjenester.nav.no/dittnav"
                   title="Gå til Ditt NAV"
                >
                    Ditt NAV
                </a>
            </div>
            {foreldreside && (
                <>
                    <div key="chevron" aria-hidden={true}>
                        <NavFrontendChevron type="høyre"/>
                    </div>
                    <a href={foreldresideUrl}
                       onClick={(event: any) => onClickForeldreLink(event)}
                       title={foreldreside.tittel}
                       className="breadcrumbs__parent"
                    >
                        {foreldreside.tittel}
                    </a>
                </>
            )}

            <div key="chevron" aria-hidden={true}>
                <NavFrontendChevron type="høyre"/>
            </div>
            <div aria-current="page"
               key="currentPage"
               className="typo-normal breadcrumbs__item breadcrumbs__current"
            >
                {tittel}
            </div>

        </>
    );

    if (width && width < 576) {
        let tilbakePilUrl = "." + tilbakeUrl;
        if ((tilbakePilUrlType && tilbakePilUrlType === UrlType.ABSOLUTE_URL) ||
            tilbakeUrl.match(/^http/) === null ) {
            tilbakePilUrl = tilbakeUrl;
        }
        crumbs = (
            <>
                <div key="chevron" aria-hidden={true}>
                    <NavFrontendChevron type="venstre"/>
                </div>
                <p className="typo-normal breadcrumbs__item">
                    <a
                        href={tilbakePilUrl}
                        title="Gå til forrige side"
                        onClick={(event: any) => onClickTilbakePil(event)}
                    >
                        Tilbake
                    </a>
                </p>
            </>
        )
    }

    return (
        <nav aria-label="Du er her" className={"breadcrumbs " + (className ? className : "")}>
            {crumbs}
        </nav>
    );
};

export default Brodsmulesti;
