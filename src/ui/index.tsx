import React from "react";
import ReactDOM from "react-dom";
import {
	Container,
	CssBaseline,
	Grid,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";
import clsx from "clsx";
import { Items } from "./items";

const styles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	content: {
		flexGrow: 1,
		overflow: "auto",
	},
	paper: {
		padding: theme.spacing(2),
		display: "flex",
		flexDirection: "column",
	},
	title: {
		display: "flex",
	},
	titlebutton: {
		marginInline: theme.spacing(1),
	},
	table: {
		marginBottom: theme.spacing(2),
	},
	fixedHeight: {
		height: 240,
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
}));

function App() {
	const classes = styles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<main className={classes.content}>
				<Container maxWidth="lg" className={classes.container}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Paper className={fixedHeightPaper}>
								<Items styles={classes} />
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</main>
		</div>
	);
}

ReactDOM.render(<App />, document.querySelector("body"));
