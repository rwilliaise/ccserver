import { PureComponent, ReactNode } from "react";
import { Item } from "../server/network";
import { ipcRenderer } from "electron";
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Title } from "./utils";
import React from "react";

type ItemsProps = { styles: Record<string, string> };

export class Items extends PureComponent<ItemsProps, { data?: Item[] }> {
	constructor(props: ItemsProps) {
		super(props);
		ipcRenderer.on("server-update", (event, args) => {
			if (args.type === "item") {
				this.setState({ data: args.data });
			}
		});
	}

	onclick(): void {
		ipcRenderer.send("main-update", { type: "scan" });
	}

	render(): ReactNode {
		const rows: JSX.Element[] = [];

		if (this.state && this.state.data) {
			this.state.data.forEach((value) => {
				rows.push(
					<TableRow>
						<TableCell>{value.count}</TableCell>
						<TableCell>{value.name}</TableCell>
						<TableCell>{value.nbtHash}</TableCell>
						<TableCell>{value.damage}</TableCell>
					</TableRow>,
				);
			});
		}

		return (
			<React.Fragment>
				<Box className={this.props.styles.title}>
					<Title>Inventory</Title>
					<Button
						variant="contained"
						color="primary"
						className={this.props.styles.titlebutton}
						onClick={this.onclick}
					>
						Sync
					</Button>
				</Box>
				<Table size="small" className={this.props.styles.table}>
					<TableHead>
						<TableRow>
							<TableCell>Count</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>NBT Hash</TableCell>
							<TableCell>Damage</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>{rows}</TableBody>
				</Table>
			</React.Fragment>
		);
	}
}
