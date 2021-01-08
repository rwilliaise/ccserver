import { Typography } from "@material-ui/core";
import React from "react";

export function Title(props: { children: React.ReactNode }): JSX.Element {
	return (
		<Typography component="h2" variant="h6" color="primary" gutterBottom>
			{props.children}
		</Typography>
	);
}
