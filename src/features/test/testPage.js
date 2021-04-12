import {
  Button,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  makeStyles,
  TextField
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { useState } from 'react'

var _ = require('lodash')

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    }
  }
}))

export const TestPage = props => {
  return (
    <Grid container direction='column' justify='flex-start' alignItems='center'>
      <Grid item container direction='column' justify='flex-start' xs={6}>
        <Grid item>
          <h1>This page can be used to test a runbook</h1>
          <h2>
            Use the following form to create an example error and submit it to
            the server
          </h2>
        </Grid>
        <Grid item>
          <TestForm />
        </Grid>
      </Grid>
    </Grid>
  )
}
export const TestForm = props => {
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [lastSessionId, setLastSessionId] = useState()
  const classes = useStyles()

  console.log(tags)

  const input = (
    <form className={classes.root} noValidate autoComplete='off' stretch>
      <FormControl fullWidth className={classes.margin}>
        <TextField
          id='standard-basic'
          label='Name'
          onChange={e => setName(e.target.value)}
        />
        <TextField
          id='standard-basic'
          label='Message'
          onChange={e => setMessage(e.target.value)}
        />
        <List subheader={<ListSubheader>Tags</ListSubheader>}>
          {tags.map(t => (
            <ListItem key={t}>
              <ListItemText>{t}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton
                  aria-label='delete'
                  onClick={() => setTags(_.without(tags, t))}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <TextField
          id='outlined-basic'
          label='Add tag'
          variant='outlined'
          value={currentTag}
          onChange={e => setCurrentTag(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label='add'
                onClick={() => {
                  setTags(_.uniq(_.concat(tags, currentTag)))
                  setCurrentTag('')
                }}
              >
                <AddIcon />
              </IconButton>
            )
          }}
        />
        <Button
          variant='contained'
          onClick={async () => {
            const payload = {
              name: name,
              message: message,
              tags: tags
            }
            console.log(payload)

            const response = await fetch(
              `${process.env.REACT_APP_RUNBOOK_BACKEND}/errors`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              }
            )

            const sessionId = await response.text()
            setLastSessionId(sessionId)
          }}
        >
          Create test session
        </Button>
      </FormControl>
    </form>
  )

  if (lastSessionId) {
    return (
      <>
        {input}
        <br />
        <Button
          fullWidth
          variant='contained'
          color='primary'
          href={'/session/' + lastSessionId}
        >
          Go to session {lastSessionId}
        </Button>
      </>
    )
  } else {
    return <>{input}</>
  }
}
