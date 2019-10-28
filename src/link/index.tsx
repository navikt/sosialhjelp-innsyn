import * as React from 'react';
import {Redirect} from "react-router";
import {REST_STATUS} from "../utils/restUtils";
import {DispatchProps} from "../redux/reduxTypes";
import {connect} from "react-redux";

interface IntlProviderProps {
	children: React.ReactNode;
}

interface StateProps {
	initRestStatus: REST_STATUS;
}

type Props = StateProps & DispatchProps & IntlProviderProps;

class Link extends React.Component<Props, {}> {
	render() {
		const url = window.location.href;
		console.log("link linklink");
		const match: RegExpMatchArray | null = url.match(/goto=\/sosialhjelp(.+?)(&error_id.*$|$)/);
		let here: string = "/innsyn";
		if (match && match[1]) {
			here = match[1];
		}
		console.log("here: " + here)

		return (
			<div className="application-spinner">
				<Redirect to={here}/>
			</div>
		)
	}
}

export default connect()(Link);
