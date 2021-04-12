import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core'
import dayjs from 'dayjs'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

import { useEffect, useState } from 'react'
import { Autocomplete } from '@material-ui/lab'
var _ = require('lodash')

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    }
  }
}))

export const Rules = props => {
  const [rules, setRules] = useState([])
  const [lastRefresh, setLastRefresh] = useState(dayjs())
  const [ruleType, setRuleType] = useState('')
  const [matcherType, setMatcherType] = useState('')
  const [ruleContent, setRuleContent] = useState('')
  const [runbookId, setRunbookId] = useState('')
  const [runbooks, setRunbooks] = useState([])
  const classes = useStyles()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_RUNBOOK_BACKEND}/runbooks`
      )
      const json = await response.json()
      console.log(json)

      setRunbooks(json)
    }
    return fetchData()
  }, [lastRefresh])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_RUNBOOK_BACKEND}/rules`
      )
      if (response.status === 200) {
        const json = await response.json()

        if (json) {
          setRules(json)
        }
      } else {
        console.log(response)
      }
    }
    return fetchData()
  }, [lastRefresh])

  const createMessage = (ruleType, matcherType) => {
    if (!ruleType || !matcherType) {
      return 'Please set rule and message type first'
    }
    if (matcherType === 'regex') {
      return `Rule will match errors with a ${ruleType} that matches the regex`
    } else {
      return `Rule will match errors with a ${ruleType} that ${matcherType}`
    }
  }

  const message = createMessage(ruleType, matcherType)
  console.log('Runbooks', runbooks)

  return (
    <Grid container direction='column' justify='flex-start' alignItems='center'>
      <Grid item>Rules come here</Grid>
      <Grid item>
        {rules.map(r => {
          const selectedRunbook = _.find(runbooks, i => i.id === r.runbook_id)
          return (
            <Accordion key={r.id}>
              <AccordionSummary
                key={r.id + '-summary'}
                expandIcon={<EditIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography className={classes.heading}>
                  {createMessage(r.rule_type, r.matcher_type) +
                    ' ' +
                    r.rule_content +
                    ' and will assign runbook with the id ' +
                    r.runbook_id}
                </Typography>
              </AccordionSummary>
              <AccordionDetails key={r.id + '-details'}>
                <form
                  className={classes.root}
                  noValidate
                  autoComplete='off'
                  stretch
                >
                  <Button
                    variant='contained'
                    color='secondary'
                    startIcon={<DeleteIcon />}
                    onClick={async () => {
                      await fetch(
                        `${process.env.REACT_APP_RUNBOOK_BACKEND}/rules/` +
                          r.id,
                        {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json'
                          }
                        }
                      )
                      setLastRefresh(dayjs())
                    }}
                  >
                    Delete rule
                  </Button>
                  <FormControl fullWidth className={classes.margin}>
                    <InputLabel id='ruleType-label-edit'>Rule type</InputLabel>
                    <Select
                      labelId='ruleType-label-edit'
                      id='ruleType-edit'
                      defaultValue={r.rule_type}
                      onChange={e => {
                        r.rule_type = e.target.value
                      }}
                    >
                      <MenuItem value={'name'}>Name</MenuItem>
                      <MenuItem value={'message'}>Message</MenuItem>
                      <MenuItem value={'tag'}>Tag</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth className={classes.margin}>
                    <InputLabel id='matcherType-label-edit'>
                      Matcher type
                    </InputLabel>
                    <Select
                      labelId='matcherType-label-edit'
                      id='matcherType-edit'
                      defaultValue={r.matcher_type}
                      onChange={e => {
                        r.matcher_type = e.target.value
                      }}
                    >
                      <MenuItem value={'equal'}>Equal</MenuItem>
                      <MenuItem value={'contains'}>Contains</MenuItem>
                      <MenuItem value={'regex'}>Regex</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth className={classes.margin}>
                    <Typography>{message}</Typography>
                    <TextField
                      id='standard-basic'
                      defaultValue={r.rule_content}
                      onChange={e => {
                        r.rule_content = e.target.value
                      }}
                    />
                    <Typography>and will return runbook with id</Typography>
                    <Autocomplete
                      id='combo-box-demo'
                      options={runbooks}
                      inputValue={selectedRunbook.name}
                      value={selectedRunbook}
                      disableClearable={true}
                      getOptionLabel={option => option.name}
                      onChange={(_, item) => setRunbookId(item.id)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Runbook'
                          variant='outlined'
                        />
                      )}
                    />
                    <Button
                      variant='contained'
                      onClick={async () => {
                        await fetch(
                          `${process.env.REACT_APP_RUNBOOK_BACKEND}/rules/` +
                            r.id,
                          {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(r)
                          }
                        )

                        setLastRefresh(dayjs())
                      }}
                    >
                      Update rule
                    </Button>
                  </FormControl>
                </form>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Grid>
      <Grid item>
        <form className={classes.root} noValidate autoComplete='off' stretch>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel id='ruleType-label'>Rule type</InputLabel>

            <Select
              labelId='ruleType-label'
              id='ruleType'
              value={ruleType}
              onChange={e => setRuleType(e.target.value)}
            >
              <MenuItem value={'name'}>Name</MenuItem>
              <MenuItem value={'message'}>Message</MenuItem>
              <MenuItem value={'tag'}>Tag</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel id='matcherType-label'>Matcher type</InputLabel>
            <Select
              labelId='matcherType-label'
              id='matcherType'
              value={matcherType}
              onChange={e => setMatcherType(e.target.value)}
            >
              <MenuItem value={'equal'}>Equal</MenuItem>
              <MenuItem value={'contains'}>Contains</MenuItem>
              <MenuItem value={'regex'}>Regex</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <Typography>{message}</Typography>
            <TextField
              id='standard-basic'
              onChange={e => setRuleContent(e.target.value)}
            />
            <Typography>and will return runbook</Typography>
            <Autocomplete
              id='combo-box-demo'
              disableClearable={true}
              options={runbooks}
              getOptionLabel={option => option.name}
              onChange={(_, item) => setRunbookId(item.id)}
              renderInput={params => (
                <TextField {...params} label='Runbook' variant='outlined' />
              )}
            />

            <Button
              disabled={!ruleType || !matcherType || !ruleContent || !runbookId}
              variant='contained'
              onClick={async () => {
                const payload = {
                  rule_type: ruleType,
                  matcher_type: matcherType,
                  rule_content: ruleContent,
                  runbook_id: runbookId
                }

                await fetch(`${process.env.REACT_APP_RUNBOOK_BACKEND}/rules`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(payload)
                })

                setLastRefresh(dayjs())
              }}
            >
              Create rule
            </Button>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
