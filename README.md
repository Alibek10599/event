# USDT Transfer events list
This project is aimed to fetch USDT contract Transfer events from block number `17612968` to `17612970` and represent it in paginated table.

### Required envs
#### In the backend directory create `.env` file with following variables
    MONGO_URL='Your mongo db url'
    INFURA_RPC_ID='Your Infura RPC ID key'

You can get your Infura RPC API keys here https://www.infura.io/

## To start backend
### Make sure `env` variables have initiated
    cd backend
    yarn start

## To start frontend
    cd front
    npm install
    npm start

