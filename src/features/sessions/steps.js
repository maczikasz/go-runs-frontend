import { Button, Grid, Typography } from '@material-ui/core'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useHistory, useParams } from 'react-router'

export const SessionStep = props => {
  const { sessionId, stepId } = useParams()
  const [details, setDetails] = useState()

  const history = useHistory()

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('http://localhost:8080/details/' + stepId)
      const json = await response.json()
      setDetails(json)
    }

    return getData()
  }, [stepId])

  const markStepExecuted = async () => {
    await fetch(
      `http://localhost:8080/sessions/${sessionId}/${stepId}`,
      {
        method: 'PUT'
      }
    )
    history.push(`/session/${sessionId}`)
  }

  if (!details || !details.markdown) {
    return (
      <>
        Lading the step {stepId} of session {sessionId}
      </>
    )
  }

  return (
    <Grid container direction='column'>
      <Grid item>
        <Typography variant='h3'>{details.summary}</Typography>
      </Grid>
      <Grid item>
        <ReactMarkdown children={details.markdown} />
      </Grid>
      <Grid item>
        <Button variant='contained' color='primary' onClick={markStepExecuted}>
          Mark step executed
        </Button>
      </Grid>
    </Grid>
  )
}
