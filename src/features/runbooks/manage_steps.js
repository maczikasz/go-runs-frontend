import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Showdown from 'showdown'
import ReactMde from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'
import DeleteIcon from '@material-ui/icons/Delete'

const createStepCard = (step, editCallback, deleteCallback) => {
  const fetchStepDetailsAndEdit = async stepId => {
    const response = await fetch('http://localhost:8080/details/' + stepId)
    const json = await response.json()

    editCallback(null, json)
  }

  return (
    <Grid key={step.id + '-grid'} item xs={12}>
      <Card key={step.id + '-card'}>
        <CardContent>
          <Typography color='textSecondary' gutterBottom>
            {step.type}
          </Typography>
          <Typography variant='h5' component='h2'>
            {step.summary}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size='large' onClick={e => fetchStepDetailsAndEdit(step.id)}>
            Edit step
          </Button>

          <Button
            color='secondary'
            startIcon={<DeleteIcon />}
            size='large'
            onClick={e => deleteCallback(step.id)}
          >
            Delete step
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export const ManageSteps = props => {
  const [steps, setSteps] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8080/details')
      const json = await response.json()

      setSteps(json)
    }
    return fetchData()
  }, [props.refresh])

  const [open, setOpen] = useState(false)

  const [currentEditId, setCurrentEditId] = useState()
  const [currentStep, setCurrentStep] = useState({})
  const handleClickOpen = (e, step) => {
    if (step) {
      setCurrentStep(step)
      setCurrentEditId(step.id)
    } else {
      setCurrentStep({
        type: '',
        summary: '',
        markdown: ''
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = async step => {
    const payload = {
      type: step.type,
      summary: step.summary,
      markdown: {
        content: step.markdown,
        type: 'gridfs'
      }
    }

    let response

    if (currentEditId) {
      response = await fetch(`http://localhost:8080/details/${currentEditId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
    } else {
      response = await fetch('http://localhost:8080/details', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
    }

    if (response.code !== 200) {
      console.log('Failed to save step')
    }
    props.forceRefresh()
    handleClose()
  }

  const deleteStep = async stepId => {
    const response = await fetch(`http://localhost:8080/details/${stepId}`, {
      method: 'DELETE'
    })
    if (response.code !== 200) {
      console.log('Failed to save step')
    }
    props.forceRefresh()
  }

  return (
    <Grid container>
      <EditDialog
        open={open}
        handleSave={handleSave}
        handleClose={handleClose}
        data={currentStep}
        isEdit={currentEditId !== undefined}
      />
      <Grid item>
        <Button startIcon={<AddCircleIcon />} onClick={handleClickOpen}>
          Add new step
        </Button>
      </Grid>
      <Grid container>
        {steps.map(step => createStepCard(step, handleClickOpen, deleteStep))}
      </Grid>
    </Grid>
  )
}

const EditDialog = props => {
  var title = 'Create new step'
  const [stepData, setStepData] = useState()

  useEffect(() => {
    setStepData(props.data)
  }, [props.data])

  if (!stepData) {
    return <></>
  }

  if (props.isEdit) {
    title = 'Edit step'
  }
  console.log(stepData)

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby='form-dialog-title'
      disableBackdropClick={true}
    >
      <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>Runbook data</DialogContentText>
        <NewRunbookStepForm save={setStepData} value={stepData} />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color='primary'>
          Cancel
        </Button>
        <Button
          disabled={
            stepData.markdown === '' ||
            stepData.summary === '' ||
            stepData.type === ''
          }
          onClick={() => props.handleSave(stepData)}
          color='primary'
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    }
  }
}))

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
})

const NewRunbookStepForm = props => {
  console.log(props)
  const classes = useStyles()
  const [selectedTab, setSelectedTab] = useState('write')

  const setMarkdownValue = m => {
    const newData = { ...props.value }
    newData.markdown = m
    props.save(newData)
  }

  const setStepType = m => {
    const newData = { ...props.value }
    newData.type = m
    props.save(newData)
  }

  const setStepSummary = m => {
    const newData = { ...props.value }
    newData.summary = m
    props.save(newData)
  }

  return (
    <>
      <form className={classes.root} noValidate autoComplete='off' stretch>
        <FormControl fullWidth className={classes.margin}>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel id='setpType-label-edit'>Runbook type</InputLabel>
            <Select
              onChange={e => setStepType(e.target.value)}
              labelId='setpType-label-edit'
              id='setpType-edit'
              value={props.value.type}
            >
              <MenuItem value={'investigation'}>Investigation</MenuItem>
              <MenuItem value={'workaround'}>Workaround</MenuItem>
              <MenuItem value={'escalation'}>Escalation</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField
              value={props.value.summary}
              onChange={e => setStepSummary(e.target.value)}
              label='Summary'
              id='standard-basic'
            />
          </FormControl>
          <ReactMde
            value={props.value.markdown}
            onChange={setMarkdownValue}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown =>
              Promise.resolve(converter.makeHtml(markdown))
            }
          />
        </FormControl>
      </form>
    </>
  )
}
