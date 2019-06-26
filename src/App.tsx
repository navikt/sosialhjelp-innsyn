import React from 'react';
import './App.less';
import AppBanner from "./components/appBanner/AppBanner";
import BrodsmuleSti from "./components/brodsmuleSti/BrodsmuleSti";
import SendtSoknad from "./pages/SendtSoknad";


const App: React.FC = () => {
	return (
		<div className="informasjon-side">
			<AppBanner/>

			<div className="blokk-center">
				<BrodsmuleSti/>
				<SendtSoknad />
			</div>
		</div>
	);
};

export default App;
