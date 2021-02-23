import React from 'react'
import ReactDOM from 'react-dom'
import {
  AppBar,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Toolbar
} from '@material-ui/core'
import clsx from 'clsx'
import { Items } from './items'
import { ipcRenderer } from 'electron'
import { Refresh } from '@material-ui/icons'

const styles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    overflow: 'auto'
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  title: {
    display: 'flex'
  },
  table: {
    marginBottom: theme.spacing(2)
  },
  appBarSpacer: theme.mixins.toolbar,
  fixedHeight: {
    height: 240
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  refreshButton: {
    marginRight: 36
  }
}))

function onclick(): void {
  ipcRenderer.send('main-update', { type: 'scan' })
}

function App() {
  const classes = styles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="refresh"
            onClick={onclick}
            className={classes.refreshButton}>
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
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
  )
}

ReactDOM.render(<App />, document.querySelector('body'))
