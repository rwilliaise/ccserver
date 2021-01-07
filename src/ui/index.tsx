import React from "react";
import ReactDOM from "react-dom";
import {
	Container,
	CssBaseline,
	Grid,
	makeStyles, Paper, Table, TableBody, TableCell, TableHead, TableRow
} from "@material-ui/core";
import clsx from "clsx";
import {Title} from "@material-ui/icons";

const styles = makeStyles((theme) => ({
	root: {
		display: "flex"
	},
	content: {
		flexGrow: 1,
		overflow: "auto"
	},
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	table: {
		marginBottom: theme.spacing(2)
	},
	fixedHeight: {
		height: 240,
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	}
}));

function App() {
	const classes = styles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	return (
		<div className={classes.root}>
			<CssBaseline/>
			<main className={classes.content}>
				<Container maxWidth="lg" className={classes.container}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Title>Inventory</Title>
								<Table size="small" className={classes.table}>
									<TableHead>
										<TableRow>
											<TableCell>Count</TableCell>
											<TableCell>Name</TableCell>
											<TableCell>Request</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell>1</TableCell>
											<TableCell>minecraft:stone</TableCell>
											<TableCell>Request</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</main>
		</div>
	);
}

ReactDOM.render(<App/>, document.querySelector("body"));
