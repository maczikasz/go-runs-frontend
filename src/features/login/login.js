import { Button, Grid } from '@material-ui/core'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Switch, useHistory, useLocation } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { setToken } from './login_slice'
import { setUserinfo } from './user_slice'

function useQuery () {
  return new URLSearchParams(useLocation().search)
}

const OauthCallbackHandler = props => {
  const query = useQuery()
  const dispatch = useDispatch()
  const history = useHistory()

  console.log(query)
  useEffect(() => {
    const fetchData = async () => {
      const payload = {
        code: query.get('code')
      }
      const resp = await fetch('http://localhost:8089/token', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      const token = await resp.json()
      dispatch(setToken(token))
      history.push('/')
    }

    return fetchData()
  }, [])

  return <>Oauth</>
}

export const Login = props => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route path='/oauth-callback'>
            <OauthCallbackHandler />
          </Route>
          <Route
            path='/'
            render={() => (
              <Grid container>
                <Grid item>
                  <Button href='http://localhost:8080/login'>
                    Login with OAUTH2
                  </Button>
                </Grid>
              </Grid>
            )}
          />
        </Switch>
      </BrowserRouter>
    </div>
  )
}
