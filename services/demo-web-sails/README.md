```
$ docker build -t smf --build-arg SERVICE=demo-web .
$ docker run -p 127.0.0.1:1337:1337/tcp smf
```
