import React from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { Rules } from './features/rules/rules'
import { Session } from './features/sessions/session'
import { SessionStep } from './features/sessions/steps'
import { ListSessions } from './features/sessions/sessions'
import { TestPage } from './features/test/testPage'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import SearchIcon from '@material-ui/icons/Search'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import SlideshowIcon from '@material-ui/icons/Slideshow'
import { Runbooks } from './features/runbooks/runbooks'

function App () {
  const router = (
    <div>
      <Switch>
        <Route path='/test'>
          <TestPage />
        </Route>
        <Route path='/sessions'>
          <ListSessions />
        </Route>
        <Route path='/session/:sessionId/:stepId'>
          <SessionStep />
        </Route>
        <Route path='/session/:sessionId'>
          <Session />
        </Route>
        <Route path='/rules'>
          <Rules />
        </Route>
        <Route path='/runbooks'>
          <Runbooks />
        </Route>
      </Switch>
    </div>
  )
  return (
    <div className='App'>
      <BrowserRouter>
        <PermanentDrawerLeft>{router}</PermanentDrawerLeft>
      </BrowserRouter>
    </div>
  )
}

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  }
}))

const PermanentDrawerLeft = props => {
  console.log(props)
  const classes = useStyles()
  const items = [
    {
      text: 'Sessions',
      icon: <NotificationsActiveIcon />,
      link: '/sessions'
    },
    { text: 'Rules', icon: <SearchIcon />, link: '/rules' },
    {
      text: 'Runbooks',
      icon: <MenuBookIcon />,
      link: '/runbooks'
    },
    {
      text: 'Test page',
      icon: <SlideshowIcon />,
      link: '/test'
    }
  ]

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <Typography variant='h6' noWrap>
            Runbook manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant='permanent'
        classes={{
          paper: classes.drawerPaper
        }}
        anchor='left'
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {items.map((item, index) => (
            <ListItem button component={Link} to={item.link} key={item.text}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  )
}

export default App
