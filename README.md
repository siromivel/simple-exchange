## Build and Run Locally
In order to run the app you will need a local Redis and Postgresql installation.

##### Create a local user in Postgres
`createuser simplex -s -P`
This will bring up a prompt to enter the new user's password, `password` is the default in the ORM and will allow you to run the app with no further config. Note that the newly created user will be a superuser(due to the `-s` arg,) in your local Postgres instance.

##### Create the database for the application
`createdb simple_exchange`

##### Clone the repo locally
SSH: `git clone git@github.com:siromivel/simple-exchange.git`

HTTPS: `git clone https://github.com/siromivel/simple-exchange.git`

##### Install all dependencies
`cd simple_exchange` and run `npm run build-dev`

##### Run the database migrations
`npm run db:migrate`

##### Start the app
`npm run server:dev`

Once you see `[NestApplication] Nest application successfully started` in the logs you should be able to access the app at `localhost:3000`.

## Tests
Test coverage is limited to critical components of the backend; run these with `npm run server:test`.

## General Architecture
The backend exposes a REST API used for working with users, trades etc... and a WebSocket gateway that handles price data from Bittrex. The websocket gateway handles both receiving price data from the remote exchange as well as passing price updates to the frontend. Data about the latest observed prices of all supported assets is cached in a local Redis store; when a request to execute a trade is received the price sent from the browser is checked against the price for the relevant trading pair stored in Redis before allowing the trade to be executed.

## Tools Used
The primary technologies/tools used for this application are(in no particular order): NestJS, PostgreSQL, React, Redis, SocketIO, TypeScript and Webpack.

## Notes
All of the requested functionality has been implemented in this app. The rough spots are around test coverage and error handling UX; the front end is not currently handling errors granuarly(or really at all 😅). I wrote integration tests for the most important backend features (executing trades and the user controller,) but otherwise there aren't a lot of tests. There are _no_ front end or end-to-end tests at this time.

On initial spin-up it might take a few seconds for prices to appear for all supported trading pairs; this is due to waiting on data from the Bittrex feed. This could be improved by making some initial REST requests to their API and setting initial prices based off of those, I felt like this was unecessary as the backend shouldn't be starting fresh all the time (if it is we've got deeper issues 😨). It does make an initial request through the websocket to Bittrex for a summary of all markets but the result of this request is unreliable at best. Trading pairs are unavailable in the UI until they have a price.

The trading UI currently doesn't show a user's previous trades or the details of a trade after execution -- the "Holdings" display should update immediately, so the result of a trade may be seen there.

The UI for inputting users is a bit rough still, submitting a duplicate user name will receive a 500 and break, sorry!
