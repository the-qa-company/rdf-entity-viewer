# rdf-entity-viewer

A React/MUI component to visualize and explore RDF entities.

## Getting started

1) Make sure you have the peer dependencies installed, see `package.json`. Basically you have to install:
    - React
    - Material UI (with icons)
2) Install the library using `npm i rdf-entity-viewer`
3) Import the stylesheet (preferably in the file that is your app entry point, e.g `main.tsx`, `App.js`, etc.) like that:

```js
// In the file that is the entry point (main or App for instance)

import 'rdf-entity-viewer/dist/style.css'

// ...
```

4) You can now use the component like this: 🎉

```tsx
// file: MyAwesomeComponent.tsx

import RdfEntityViewer from 'rdf-entity-viewer'
import { Box } from '@mui/material'

function MyAwesomeComponent (): JSX.Element {
    return (
        <Box>
            <RdfEntityViewer
                iri='http://the-qa-company.com/plant2'
                label='Plant 2'
            />
        </Box>
    )
}

export default MyAwesomeComponent

```


## Contributing

Branch | Description
-------|------------------------------------
main   | Main branch, used to deploy on npm
dev-*  | Development branches

To contribute, please branch off `main` and create a branch named `dev-*` (e.g. `dev-responsive-ui`). When you are finished, create a **pull request** with the target `main`.

### Information about the CI

A CI has been setup on `main`, it reads the version from `package.json` and if it detects a new version it does 2 things with it:

1) Creates a new tag on git (e.g. "v1.4.12")
2) Publishes the package on npm

