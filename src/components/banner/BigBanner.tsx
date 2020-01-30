import * as React from "react";
import "./bigbanner.less";
import Head from "../ikoner/Head";
import Brodsmulesti, {UrlType} from "../brodsmuleSti/BrodsmuleSti";
import {getDittNavUrl} from "../../utils/restUtils";

const BigBanner: React.FC<{ tittel: string } & {}> = ({tittel}) => {
    return (
        <div className="big_banner">
            <div className="big_banner__blokk-center">
                <div className="big_banner__brodsmuler">
					<span className="big_banner__brodsmuler__head">
						<Head/>
					</span>
                    <div>
                        <Brodsmulesti
                            tittel="Økonomisk sosialhjelp"
                            tilbake={getDittNavUrl()}
                            tilbakePilUrlType={UrlType.ABSOLUTE_URL}
                        />
                    </div>
                </div>
                <h1 className="big_banner__tittel">
                    {tittel}
                </h1>
            </div>
        </div>
    );
};

export default BigBanner;
