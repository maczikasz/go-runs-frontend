import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Session } from './features/sessions/session'
import { SessionStep } from './features/sessions/steps'
import { TestPage } from './features/test/testPage'

function App () {
  return (
    <div className='App'>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path='/test'>
              <TestPage />
            </Route>
            <Route path='/session/:sessionId/:stepId'>
              <SessionStep />
            </Route>
            <Route path='/session/:sessionId'>
              <Session />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
