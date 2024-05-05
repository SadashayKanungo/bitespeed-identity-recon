# Identity Reconciler - Bitespeed Backend Developer Task

This backend service is built using Node.js and MySQL.
It supports two endpoints:

- GET '/' for showing table contents
- POST '/identity' for reconciling an identity with the table contents

Task details can be found [here](https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-53392ab01fe149fab989422300423199).

## Hosted online

The app is hosted on Clever Cloud - [Link](https://app-9254514c-d477-4449-b343-7ed3a7c705e6.cleverapps.io/)

## Run locally

To run the app locally, you will need Node.js (v20 is preferrable) and MySQL Community Server.

#### Create a .env file in the root directory with the following contents:

```
PORT=3000
DB_HOST=127.0.0.1
DB_USER= <your mysql username>
DB_PASSWORD= <your mysql password>
DB_NAME=identity_recon
```

#### Start MySQL Community Server and run the following command

```
mysql> CREATE DATABASE identity_recon;
```

#### Navigate to the root directory in the terminal and run the following command

```
npm install && npm run build && npm start
```

#### The server will startup and listen on http://127.0.0.1:3000
