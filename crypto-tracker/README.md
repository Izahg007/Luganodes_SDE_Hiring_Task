
# Crpto Tracker with Coin Gecko API

The project is made using ReactJs for frontend, Express and NodeJs run the backend, for APIs we have used CoinGecko and firebase. We have used firebase real time database as our backedn NoSQL database.



## Deployment

To deploy this project

Build the Docker images:

Go to the root folder of the project (crypto-tracker) in the terminal/command prompt.
Run the following commands:
```bash
  docker build -t frontend-image .
  docker build -t backend-image ./backend
```

Run the Docker Containers using
```bash
  docker-compose up
```
Your React app will start on http://localhost:3000

## Images
![pic1](./public/ss1.png)
![pic1](./public/ss2.png)