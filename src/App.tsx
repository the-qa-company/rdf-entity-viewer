import RdfEntityViewer from '@/lib/RdfEntityViewer'
import { Box } from '@mui/material'

function App (): JSX.Element {
  return (
    <Box sx={{ maxWidth: '700px', margin: '0 auto' }}>
      <RdfEntityViewer
        iri='https://example.com/iri'
        label='Example IRI'
      />
    </Box>
  )
}

export default App
