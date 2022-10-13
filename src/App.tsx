import RdfEntityViewer, { RdfJson } from '@/lib/RdfEntityViewer'
import { Box, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

import s from './App.module.scss'

const wikidataEntityRegex = /\/?(Q[1-9][0-9]*)/

function App (): JSX.Element {
  const [userInput, setUserInput] = useState('')
  const [entity, setEntity] = useState<string>()
  const [userInputBadFormat, setUserInputBadFormat] = useState(false)
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<RdfJson>()

  // Set entity and detect bad format
  const handleUserInput = useCallback(() => {
    const match = userInput.match(wikidataEntityRegex)
    if (match === null) {
      setUserInputBadFormat(true)
      setEntity(undefined)
      return
    }
    setUserInputBadFormat(false)
    setEntity(match[1])
  }, [userInput])

  // Debounce user input and call handleUserInput
  useEffect(() => {
    if (userInput === '') return
    const t = setTimeout(handleUserInput, 1000)
    return () => clearTimeout(t)
  }, [userInput])

  // Make a request to the Wikidata API to get the data
  const makeRequest = useCallback(() => {
    if (entity === undefined) return
    const params = new URLSearchParams()
    params.set('query', `CONSTRUCT { wd:${entity} ?p ?o } WHERE { wd:${entity} ?p ?o }`)
    setError(undefined)
    setLoading(true)
    fetch(`https://query.wikidata.org/sparql?${params.toString()}`, {
      headers: {
        Accept: 'application/rdf+json'
      }
    })
      .then(async (res) => await res.json())
      .then(res => setData(res))
      .catch(err => {
        const errMsg = err.message
        setError(typeof errMsg === 'string' ? errMsg : 'Unknown error')
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [entity])

  // Make a request every time the entity changes
  useEffect(() => {
    makeRequest()
  }, [entity, makeRequest])

  return (
    <Box className={s.container}>
      <TextField
        label='Wikidata entity URL or ID'
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && makeRequest()}
        error={userInputBadFormat}
        helperText={userInputBadFormat ? 'Invalid format' : undefined}
        className={s.textfield}
        sx={t => ({ bgcolor: t.palette.background.paper })}
      />
      <RdfEntityViewer
        iri={entity === undefined ? undefined : `http://www.wikidata.org/entity/${entity}`}
        data={data}
        loading={loading}
        error={error}
        forceExpanded
      />
    </Box>
  )
}

export default App
