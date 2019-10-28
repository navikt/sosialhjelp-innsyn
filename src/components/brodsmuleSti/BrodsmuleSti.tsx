import * as React from "react";
import "./brodsmuleSti.less";
import {Normaltekst} from "nav-frontend-typografi";
import {useSelector} from "react-redux";

const BrodsmuleSti: React.FC<{}> = () => {
	const brodsmulesti = useSelector((state: any) => state.navigasjon.brodsmulesti);
	return (
		<div className="brodsmulesti">
			<Normaltekst>
				<a href="https://tjenester.nav.no/dittnav">Ditt NAV</a>
				{brodsmulesti.map((element: any, index: number) => {
					return (
						<span key={index}>
							<> / </>
							{index === brodsmulesti.length - 1 && (
								<>{element.tittel}</>
							)}
							{index !== brodsmulesti.length - 1 && (
								<a href={element.sti}>{element.tittel}</a>
							)}
						</span>
					);
				})}
			</Normaltekst>
		</div>
	);
};

export default BrodsmuleSti;
