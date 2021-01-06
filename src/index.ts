import { app, BrowserWindow } from "electron"
import * as path from "path";

function createWindow () {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			devTools: true
		}
	});
	mainWindow.loadURL(path.join("file://", __dirname, "/index.html"));

	console.log(path.join("file://", __dirname, "/index.html"));

	const serverWindow = new BrowserWindow({
		parent: mainWindow,
		show: false,
		webPreferences: {
			nodeIntegration: true
		}
	});
	serverWindow.loadURL(path.join("file://", __dirname, "/server.html"));
}

app.whenReady().then(() => {
	createWindow();
});

app.on('window-all-closed', () => {
	app.quit();
});
