import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import dayjs from 'dayjs'

var _ = require('lodash')

export const ListSessions = props => {
  const [sessions, setSessions] = useState([])
  const [runbooks, setRunbooks] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8080/runbooks')
      const json = await response.json()

      setRunbooks(json)
    }
    return fetchData()
  },[])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8080/sessions')
      const json = await response.json()

      setSessions(json)
    }

    return fetchData()
  },[])

  console.log(sessions)
  console.log(runbooks)
  return (
    <Grid container>
      <Grid item>
        <TableContainer component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Session id</TableCell>
              <TableCell>Error name</TableCell>
              <TableCell>Completed steps</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map(s => (
              <Row
                session={s}
                runbook={_.find(runbooks, i => i.id === s.runbook.id)}
              />
            ))}
          </TableBody>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

const Row = props => {
  console.log(props)
  const session = props.session
  const runbook = props.runbook
  const [open, setOpen] = useState(false)
  if (!session || !runbook) {
    return <></>
  }
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography>{session.session_id}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{session.error.name}</Typography>
        </TableCell>
        <TableCell>
          <Typography>
            {Object.keys(session.stats.completed_steps).length}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Accordion>
              <AccordionSummary>Triggered by</AccordionSummary>
              <AccordionDetails>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography>Name: {session.error.name}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>Message: {session.error.message}</Typography>
                  </Grid>
                  <Grid item>
                    <List>
                      {session.error.tags.map(t => (
                        <ListItem>
                          <ListItemText>{t}</ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                Session history (Completed{' '}
                {Object.keys(session.stats.completed_steps).length} of{' '}
                {runbook.steps.length})
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant='h6' gutterBottom component='div'>
                  History
                </Typography>
                <List margin>
                  {Object.entries(session.stats.completed_steps).map(stat => (
                    <Box>
                      <ListItem>
                        <ListItemText>
                          Step with id {stat[0]} was completed at{' '}
                          {dayjs(stat[1]).toString()}
                        </ListItemText>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            <Button href={`/session/${session.session_id}`}>
              Open session
            </Button>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
