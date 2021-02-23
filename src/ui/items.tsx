import { PureComponent, ReactNode } from 'react'
import { Item } from '../server/network'
import { ipcRenderer } from 'electron'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core'
import { Title } from './utils'
import React from 'react'

type ItemsProps = { styles: Record<string, string> }

function Item(props: { item: Item }): JSX.Element {
  return (
    <TableRow>
      <TableCell>{props.item.count}</TableCell>
      <TableCell>{props.item.name}</TableCell>
      <TableCell>{props.item.nbtHash}</TableCell>
      <TableCell>{props.item.damage}</TableCell>
    </TableRow>
  )
}

export class Items extends PureComponent<ItemsProps, { data?: Item[] }> {
  constructor(props: ItemsProps) {
    super(props)
    ipcRenderer.on('server-update', (event, args) => {
      if (args.type === 'item') {
        this.setState({ data: args.data })
      }
    })
  }

  render(): ReactNode {
    const rows: JSX.Element[] = []

    if (this.state && this.state.data) {
      this.state.data.forEach((value) => {
        rows.push(<Item item={value} />)
      })
    }

    return (
      <React.Fragment>
        <Box className={this.props.styles.title}>
          <Title>Inventory</Title>
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
    )
  }
}
