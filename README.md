# rdf-entity-viewer

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

