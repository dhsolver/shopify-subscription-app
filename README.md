# subscription-app

## Requirements

- yarn
- ngrok

## Running the app

1. clone this repository using ssh
2. `cd subscription-app`
3. run `yarn build` to build a production bundle
4. run `yarn start` to start a mimicked production server
5. run `ngrok http 3000` to set a tunnel and use the https address given to see what it would look like in a production-like environment

### Side notes

- To run in a development environment with hot-reload, run `yarn dev`
- To run linters, run `yarn lint`
- To run tests, run `yarn test`
