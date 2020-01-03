```
$ docker build -t smf --build-arg SERVICE=demo-message-broker .
$ docker run -e "MESSAGE_BROKER_ENABLED=true" -e "RABBITMQ_URL=amqp://<username>:<password>@localhost:5672" --network="host" smf
```
