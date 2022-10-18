import RdfEntityViewer, { RdfJson } from '@/lib/RdfEntityViewer'
import { Box, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

import logoTheQACompany from './res/logo-bgwhite.svg'
import logoNPM from './res/npm.png'
import logoGH from './res/github.png'

import s from './App.module.scss'

const wikidataPrefixes = {
  bd: 'http://www.bigdata.com/rdf#',
  cc: 'http://creativecommons.org/ns#',
  dct: 'http://purl.org/dc/terms/',
  geo: 'http://www.opengis.net/ont/geosparql#',
  ontolex: 'http://www.w3.org/ns/lemon/ontolex#',
  owl: 'http://www.w3.org/2002/07/owl#',
  p: 'http://www.wikidata.org/prop/',
  pq: 'http://www.wikidata.org/prop/qualifier/',
  pqn: 'http://www.wikidata.org/prop/qualifier/value-normalized/',
  pqv: 'http://www.wikidata.org/prop/qualifier/value/',
  pr: 'http://www.wikidata.org/prop/reference/',
  prn: 'http://www.wikidata.org/prop/reference/value-normalized/',
  prov: 'http://www.w3.org/ns/prov#',
  prv: 'http://www.wikidata.org/prop/reference/value/',
  ps: 'http://www.wikidata.org/prop/statement/',
  psn: 'http://www.wikidata.org/prop/statement/value-normalized/',
  psv: 'http://www.wikidata.org/prop/statement/value/',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  schema: 'http://schema.org/',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  wd: 'http://www.wikidata.org/entity/',
  wdata: 'http://www.wikidata.org/wiki/Special:EntityData/',
  wdno: 'http://www.wikidata.org/prop/novalue/',
  wdref: 'http://www.wikidata.org/reference/',
  wds: 'http://www.wikidata.org/entity/statement/',
  wdt: 'http://www.wikidata.org/prop/direct/',
  wdtn: 'http://www.wikidata.org/prop/direct-normalized/',
  wdv: 'http://www.wikidata.org/value/',
  wikibase: 'http://wikiba.se/ontology#',
  xsd: 'http://www.w3.org/2001/XMLSchema#'
}

function App (): JSX.Element {
  const [userInput, setUserInput] = useState('')
  const [iri, setIri] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<RdfJson>()
  const [shouldAutoSend, setShouldAutoSend] = useState(false)

  // Read query from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('query')
    if (query !== null) {
      setShouldAutoSend(true)
      setUserInput(query)
    }
  }, [])

  // Set IRI from user input
  const handleUserInput = useCallback(() => {
    if (/^https?:\/\//.test(userInput)) {
      setIri(userInput)
    } else {
      const p = Object.keys(wikidataPrefixes).find(p => userInput.startsWith(`${p}:`))
      if (p !== undefined) {
        setIri(userInput.replace(`${p}:`, wikidataPrefixes[p as keyof typeof wikidataPrefixes]))
      } else {
        setError('Invalid input')
      }
    }
  }, [userInput])

  // Auto send when requested
  useEffect(() => {
    if (shouldAutoSend) {
      setShouldAutoSend(false)
      handleUserInput()
    }
  }, [shouldAutoSend, handleUserInput])

  // Make a request to the Wikidata API to get the data
  const makeRequest = useCallback(() => {
    if (iri === undefined) return
    // Store query in URL params
    const newPageUrl = new URL(window.location as any)
    newPageUrl.searchParams.set('query', userInput)
    window.history.pushState({}, '', newPageUrl)
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
        ?pred2 rdfs:label ?pred2Label .
        ?obj2 rdfs:label ?obj2Label .
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
        
          # Find label of predicates p:PXXX
          OPTIONAL {
            VALUES ?link0 { wikibase:directClaim wikibase:directClaimNormalized wikibase:claim wikibase:statementProperty wikibase:statementValue wikibase:statementValueNormalized wikibase:qualifier wikibase:qualifierValue wikibase:qualifierValueNormalized wikibase:reference wikibase:referenceValue wikibase:referenceValueNormalized }
            ?predEntity ?link0 ?pred .
            OPTIONAL {
              ?predEntity rdfs:label ?predLabel .
              FILTER (LANG(?predLabel) = "en")
            }
          }
        
          # Find label of statement predicates (predicates inside statements)
          OPTIONAL {
            VALUES ?link1 { wikibase:directClaim wikibase:directClaimNormalized wikibase:claim wikibase:statementProperty wikibase:statementValue wikibase:statementValueNormalized wikibase:qualifier wikibase:qualifierValue wikibase:qualifierValueNormalized wikibase:reference wikibase:referenceValue wikibase:referenceValueNormalized }
            ?pred2Entity ?link1 ?pred2 .
            OPTIONAL {
              ?pred2Entity rdfs:label ?pred2Label .
              FILTER (LANG(?pred2Label) = "en")
            }
          }

          # Find label of statement objects (objects inside statements)
          OPTIONAL {
            ?obj2 rdfs:label ?obj2Label .
            FILTER (LANG(?obj2Label) = "en")
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
      <Box className={s.header}>
        <a href='https://the-qa-company.com' target='_blank' rel='noreferrer' className={s.linkTheQACompany}>
          <img src={logoTheQACompany} alt='The QA Company Logo' className={s.imgTheQACompany} />
          <Typography variant='h3' sx={{ opacity: 0.9, fontSize: '32px' }}>
            The QA Company
          </Typography>
        </a>
        <Box className={s.rightLinks}>
          <a href='https://www.npmjs.com/package/rdf-entity-viewer' target='_blank' rel='noreferrer'>
            <img src={logoNPM} className={s.imgNPM} alt='NPM Logo' />
          </a>
          <a href='https://github.com/the-qa-company/rdf-entity-viewer' target='_blank' rel='noreferrer'>
            <img src={logoGH} className={s.imgGH} alt='GitHub Logo' />
          </a>
        </Box>
      </Box>
      <Typography variant='h1' textAlign='center' fontSize='52px'>
        RDF Entity Explorer
      </Typography>
      <TextField
        label='Wikidata IRI (with or without prefix)'
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleUserInput()}
        placeholder='wd:Q19399674'
        className={s.textfield}
        sx={t => ({ '.MuiInputBase-input': { bgcolor: t.palette.background.paper } })}
      />
      <RdfEntityViewer
        iri={iri}
        data={data}
        loading={loading}
        error={error}
        forceExpanded
        prefixes={wikidataPrefixes}
      />
    </Box>
  )
}

export default App
