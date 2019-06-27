import LenkepanelBase from "nav-frontend-lenkepanel/lib/Lenkepanel-base";
import PaperClip from "../ikoner/PaperClip";
import Coins from "../ikoner/Coins";
import React from "react";

const VedleggUtbetalingerLenker: React.FC = () => {

	return (
		<div className="panel-luft-over panel-ikon-grupppe">
			<LenkepanelBase href="#todo" className="panel-ikon">
				<div className="panel-ikon-boks">
					<PaperClip/>
				</div>
				<span className="panel-ikon-tekst">
					Vedlegg (0)
				</span>
			</LenkepanelBase>

			<LenkepanelBase href="#todo" className="panel-uthevet-ikon">
				<div className="panel-ikon-boks">
					<Coins/>
				</div>
				<span className="panel-ikon-tekst">
					Utbetalinger (0)
				</span>
			</LenkepanelBase>
		</div>
	);
};

export default VedleggUtbetalingerLenker;
