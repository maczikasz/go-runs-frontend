import {
  Checkbox,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

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
        checked: stats.completed_steps[s.id] !== undefined,
        name: s.summary,
        id: s.id
      }
    })
    return (
      <>
        {
          <List dense component='div' role='list'>
            {runbookSteps.map(step => {
              return (
                <ListItem key={step.id}>
                  <ListItemIcon>
                    <Checkbox checked={step.checked} />
                  </ListItemIcon>
                  <ListItemText>
                    <Link href={sessionId + '/' + step.id}>{step.name}</Link>
                  </ListItemText>
                </ListItem>
              )
            })}
          </List>
        }
      </>
    )
  } else {
    return <> Loading runbooks for session : {sessionId} </>
  }
}
