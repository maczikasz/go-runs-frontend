import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router'

export const SessionStep = props => {
  const { sessionId, stepId } = useParams()
  const [details, setDetails] = useState()

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('http://localhost:8080/details/' + stepId)
      const json = await response.json()
      setDetails(json)
    }

    return getData()
  }, [stepId])

  if (!details || !details.markdown) {
    return (
      <>
        Lading the step {stepId} of session {sessionId}
      </>
    )
  }

  return (
    <>
      <ReactMarkdown children={details.markdown} />
    </>
  )
}
