import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

var dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const createExecutedCard = (sessionId, s) => {
  return (
    <Grid item xs={3}>
      <Card>
        <CardContent>
          <Typography color='textSecondary' gutterBottom>
            {s.type}
          </Typography>
          <Typography variant='h5' component='h2'>
            {s.name}
          </Typography>
          <Alert severity='info'>
            Step executed on {dayjs(s.executed).fromNow()}
          </Alert>
        </CardContent>
        <CardActions>
          <Button size='small' href={`/session/${sessionId}/${s.id}`}>
            Execute again
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

const createSimpleCard = (sessionId, s) => {
  return (
    <Grid item xs={3}>
      <Card>
        <CardContent>
          <Typography color='textSecondary' gutterBottom>
            {s.type}
          </Typography>
          <Typography variant='h5' component='h2'>
            {s.name}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size='small' href={`/session/${sessionId}/${s.id}`}>
            Execute
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export const Session = props => {
  let { sessionId } = useParams()
  const [runbookId, setRunbookId] = useState()
  const [stats, setStats] = useState()
  const [steps, setSteps] = useState()

  useEffect(() => {
    const getData = async () => {
      const result = await fetch('http://localhost:8080/sessions/' + sessionId)
      const json = await result.json()
      setRunbookId(json.runbook.id)
      setStats(json.stats)
    }

    return getData()
  }, [sessionId])

  useEffect(() => {
    if (!runbookId) return
    const getData = async () => {
      const result = await fetch('http://localhost:8080/runbooks/' + runbookId)
      const json = await result.json()
      setSteps(json.steps)
    }

    return getData()
  }, [runbookId])

  if (steps && stats) {
    const runbookSteps = steps.map(s => {
      return {
        executed: stats.completed_steps[s.id],
        name: s.summary,
        id: s.id,
        type: s.type
      }
    })
    return (
      <Grid container>
        {runbookSteps.map(step => {
          if (step.executed) {
            return createExecutedCard(sessionId, step)
          } else {
            return createSimpleCard(sessionId, step)
          }
        })}
      </Grid>
    )
  } else {
    return <> Loading runbooks for session : {sessionId} </>
  }
}
