import { Box, Tab, Tabs } from '@material-ui/core'
import { useState } from 'react'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { ManageRunbooks } from './manage_runbooks'
import { ManageSteps } from './manage_steps'

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

export const Runbooks = props => {
  const [value, setValue] = useState(0)
  const [lastRefresh, setRefresh] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setRefresh(dayjs())
  }

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        variant='fullWidth'
        indicatorColor='primary'
        textColor='primary'
        aria-label='icon tabs example'
      >
        <Tab icon={<MenuBookIcon />} label='RUNBOOKS' {...a11yProps(0)} />
        <Tab icon={<LibraryBooksIcon />} label='STEPS' {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ManageRunbooks
          refresh={lastRefresh}
          forceRefresh={() => setRefresh(dayjs())}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ManageSteps
          refresh={lastRefresh}
          forceRefresh={() => setRefresh(dayjs())}
        />
      </TabPanel>
    </>
  )
}
