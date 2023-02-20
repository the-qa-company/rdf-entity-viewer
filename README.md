# rdf-entity-viewer

A React/MUI component to visualize and explore RDF entities.

Check out the **demo** here: [https://the-qa-company.github.io/rdf-entity-viewer](https://the-qa-company.github.io/rdf-entity-viewer)

![Screenshot of the app](https://raw.githubusercontent.com/the-qa-company/rdf-entity-viewer/main/res/demo-home.png)

## Description

The RDF Entity Viewer allows developers to easily display RDF data and allows users to quickly view the properties and values associated with an entity. For instance, let's imagine that we explore the entity "The QA Company", you will see the property "Official Website" and the associated value "www.the-qa-company.com". You may want to know more about what an "Official Website" is, to do that you can click on the link. Depending on your needs, you can configure the link so it opens in the viewer itself to have a smooth navigation or in the wikidata entity page for instance. The RDF Entity Viewer provides a modern UI to improve the readability and discoverability of your RDF data.

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

### Information about the CI

A CI has been setup on `main`, it reads the version from `package.json` and if it detects a new version it does 2 things with it:

1) Creates a new tag on git (e.g. "v1.4.12")
2) Publishes the package on npm

<hr style="margin-top: 20px; margin-bottom: 20px">

Made with ♥&ensp;by The QA Company
