import RdfEntityViewer, { RdfJson } from '@/lib/RdfEntityViewer'
import { Box, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

import s from './App.module.scss'

function App (): JSX.Element {
  const [userInput, setUserInput] = useState('')
  const [iri, setIri] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<RdfJson>()

  // Set IRI from user input
  const handleUserInput = useCallback(() => {
    setIri(userInput)
  }, [userInput])

  // Debounce user input and call handleUserInput
  useEffect(() => {
    if (userInput === '') return
    const t = setTimeout(handleUserInput, 1000)
    return () => clearTimeout(t)
  }, [userInput])

  // Make a request to the Wikidata API to get the data
  const makeRequest = useCallback(() => {
    if (iri === undefined) return
    const params = new URLSearchParams()
    // params.set('query', `CONSTRUCT { <${iri}> ?p ?o } WHERE { <${iri}> ?p ?o }`)
    params.set('query', `
      CONSTRUCT {
        # "Simple" triples
        ?sub ?p ?o .
      
        # Statements
        ?sub ?pred ?obj .
        ?pred rdfs:label ?predLabel .
        ?obj ?pred2 ?obj2 .
      } WHERE {
          # Select the subject
          BIND(<${iri}> as ?sub)
        
          # Find "simple" triples
          ?sub ?p ?o .
          FILTER((!(STRSTARTS(STR(?p), "http://www.wikidata.org/prop/direct/"))) && (!(STRSTARTS(STR(?o), "http://www.wikidata.org/entity/statement/"))))
        
          # Find triples that have a statement as object
          ?sub ?pred ?stmt .
          FILTER(STRSTARTS(STR(?pred), "http://www.wikidata.org/prop/P"))
          ?stmt ?pred2 ?obj2 .
          BIND(BNODE(STR(?stmt)) AS ?obj) # Replace the statement IRI with a bnode
        
          OPTIONAL {
            ?predEntity wikibase:claim ?pred .
            OPTIONAL {
              ?predEntity rdfs:label ?predLabel .
              FILTER (LANG(?predLabel) = "en")
            }
          }
      }
    `)
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
  }, [iri])

  // Make a request every time the entity changes
  useEffect(() => {
    makeRequest()
  }, [iri, makeRequest])

  return (
    <Box className={s.container}>
      <TextField
        label='Wikidata entity URL or ID'
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && makeRequest()}
        className={s.textfield}
        sx={t => ({ '.MuiInputBase-input': { bgcolor: t.palette.background.paper } })}
      />
      <RdfEntityViewer
        iri={iri}
        data={data}
        loading={loading}
        error={error}
        forceExpanded
        prefixes={{
          wd: 'http://www.wikidata.org/entity/',
          wdt: 'http://www.wikidata.org/prop/direct/',
          wikibase: 'http://wikiba.se/ontology#',
          p: 'http://www.wikidata.org/prop/',
          rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
          rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
          xsd: 'http://www.w3.org/2001/XMLSchema#'
        }}
      />
    </Box>
  )
}

export default App
