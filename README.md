# rdf-entity-viewer

A React/MUI component to visualize and explore RDF entities.

Check out the **demo** here: [https://the-qa-company.github.io/rdf-entity-viewer](https://the-qa-company.github.io/rdf-entity-viewer)

## Getting started

1) Make sure you have the peer dependencies installed, see `package.json` for precise information. Basically you have to install:
    - React: `npm i react react-dom`
      - See also: [Vite](https://vitejs.dev/) or [CRA](https://create-react-app.dev/)
    - Material UI (with icons): `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material`
      - See also: [The MUI guide](https://mui.com/material-ui/getting-started/installation/)
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

function MyAwesomeComponent(): JSX.Element {
  return (
    <RdfEntityViewer
      // The IRI of the entity we want to display
      iri="http://www.wikidata.org/entity/Q100501108"
      // The data in the rdf+json format
      data={{
        "http://www.wikidata.org/entity/Q100501108": {
          "http://schema.org/dateModified": [
            {
              value: "2022-08-24T09:15:45Z",
              type: "literal",
              datatype: "http://www.w3.org/2001/XMLSchema#dateTime",
            }
          ],
          "http://schema.org/description": [
            {
              value: "Company specialised in Question Answering technologies",
              type: "literal",
              lang: "en",
            },
            {
              value: "bedrijf uit Frankrijk",
              type: "literal",
              lang: "nl",
            }
          ]
        }
      }}
    />
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

<hr style="margin-top: 20px; margin-bottom: 20px">

Made with ♥&ensp;by The QA Company
