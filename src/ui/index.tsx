import React from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import {Checkbox} from "@material-ui/core";

function App() {
	return (
		<div>
			<Button variant="contained" color="primary">
				Hallo, welt!
			</Button>
			<Checkbox inputProps={{ "aria-label": "primary checkbox" }} />
		</div>
	);
}

ReactDOM.render(<App/>, document.querySelector("#app"));
