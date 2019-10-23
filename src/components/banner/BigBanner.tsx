import * as React from "react";
import "./bigbanner.less";
import Head from "../ikoner/Head";
import BrodsmuleSti from "../brodsmuleSti/BrodsmuleSti";

const BigBanner: React.FC<{ tittel: string } & {}> = ({ tittel }) => {
	return (
		<div className="big_banner">
			<div className="big_banner__blokk-center">
				<div className="big_banner__brodsmuler"><span className="big_banner__brodsmuler__head"><Head/></span><BrodsmuleSti/></div>
				<h1 className="big_banner__tittel">
					{tittel}
				</h1>
			</div>
		</div>
	);
};

export default BigBanner;
