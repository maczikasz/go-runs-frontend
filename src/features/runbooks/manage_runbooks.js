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
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography
} from '@material-ui/core'
import { useEffect, useState } from 'react'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import DeleteIcon from '@material-ui/icons/Delete'

import { Autocomplete } from '@material-ui/lab'
var _ = require('lodash')

const createRunbookCard = (runbook, editCallback, deleteCallback) => {
  return (
    <Grid key={runbook.id + '-grid'} item xs={12}>
      <Card key={runbook.id + '-card'}>
        <CardContent>
          <Typography variant='h5' component='h2'>
            {runbook.name}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size='large' onClick={e => editCallback(runbook)}>
            Edit runbook
          </Button>

          <Button
            color='secondary'
            startIcon={<DeleteIcon />}
            size='large'
            onClick={e => deleteCallback(runbook.id)}
          >
            Delete runbook
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export const ManageRunbooks = props => {
  const [steps, setSteps] = useState([])
  const [runbooks, setRunbooks] = useState([])
  const [open, setOpen] = useState(false)

  const [currentEditId, setCurrentEditId] = useState()
  const [currentRunbook, setCurrentRunbook] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8080/details')
      const json = await response.json()

      setSteps(json)
    }
    return fetchData()
  }, [props.refresh])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8080/runbooks')
      const json = await response.json()
      console.log(json)

      setRunbooks(json)
    }
    return fetchData()
  }, [props.refresh])

  const deleteRunbook = async runbookId => {
    const response = await fetch(
      `http://localhost:8080/runbooks/${runbookId}`,
      {
        method: 'DELETE'
      }
    )
    if (response.code !== 200) {
      console.log('Failed to save step')
    }
    props.forceRefresh()
  }

  const handleSave = async runbook => {
    const payload = {
      name: runbook.name,
      steps: runbook.steps.map(s => s.id)
    }

    let response
    if (currentEditId) {
      response = await fetch(
        `http://localhost:8080/runbooks/${currentEditId}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload)
        }
      )
    } else {
      response = await fetch('http://localhost:8080/runbooks', {
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

  const handleOpen = isNew => {
    if (isNew) {
      setCurrentRunbook({ name: '', steps: [] })
      setCurrentEditId(undefined)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setCurrentRunbook({ name: '', steps: [] })
    setOpen(false)
  }

  const handleEdit = item => {
    setCurrentRunbook(item)
    setCurrentEditId(item.id)

    handleOpen(false)
  }

  return (
    <Grid container>
      <EditDialog
        steps={steps}
        open={open}
        handleSave={handleSave}
        handleClose={() => handleClose()}
        data={currentRunbook}
        isEdit={currentEditId}
      />
      <Grid item>
        <Button startIcon={<AddCircleIcon />} onClick={() => handleOpen(true)}>
          Add new runbook
        </Button>
      </Grid>
      <Grid container>
        {runbooks.map(runbook =>
          createRunbookCard(runbook, handleEdit, deleteRunbook)
        )}
      </Grid>
    </Grid>
  )
}

const EditDialog = props => {
  console.log(props)
  var title = 'Create new runbook'
  const [runbookData, setRunbookData] = useState()

  useEffect(() => {
    setRunbookData(props.data)
  }, [props.data])

  console.log(runbookData)
  if (!runbookData) {
    return <></>
  }

  if (props.isEdit) {
    title = 'Edit step'
  }

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
        <NewRunbookForm
          steps={props.steps}
          save={setRunbookData}
          value={runbookData}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color='primary'>
          Cancel
        </Button>
        <Button
          disabled={runbookData.name === '' || runbookData.steps.size === 0}
          onClick={() => props.handleSave(runbookData)}
          color='primary'
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const NewRunbookForm = props => {
  console.log(props)
  const changeSteps = steps => {
    console.log('chage', steps)
    const newValue = { ...props.value }
    newValue.steps = steps
    props.save(newValue)
  }

  const setRunbookname = name => {
    const newValue = { ...props.value }
    newValue.name = name
    props.save(newValue)
  }

  return (
    <form>
      <FormControl fullWidth>
        <TextField
          value={props.value.name}
          onChange={e => setRunbookname(e.target.value)}
          label='name'
          id='standard-basic'
        />
      </FormControl>
      <FormControl>
        <ListWithSearchField
          items={props.value.steps.map(id =>
            _.find(props.steps, s => s.id === id)
          )}
          save={changeSteps}
          options={props.steps}
        />
      </FormControl>
    </form>
  )
}

const ListWithSearchField = props => {
  console.log(props)
  const [items, setItems] = useState(props.items)

  const [selectableItems, setSelectableItems] = useState()
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setSelectableItems(_.without(props.options, ...items))
  }, [items, props.options])

  useEffect(() => {
    props.save(items)
  }, [items])

  const addItem = item => {
    if (item) {
      setItems([...items, item])
    }
    setInputValue('')
  }

  return (
    <>
      <List>
        {items.map(i => {
          return (
            <ListItem>
              <ListItemText>{i.summary}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton>
                  <DeleteIcon onClick={() => setItems(_.without(items, i))} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      </List>
      <Autocomplete
        id='combo-box-demo'
        options={selectableItems}
        inputValue={inputValue}
        getOptionLabel={option => option.summary}
        style={{ width: 300 }}
        onChange={(_, v) => addItem(v)}
        renderInput={params => (
          <TextField {...params} label='Runbook step' variant='outlined' />
        )}
      />
    </>
  )
}
