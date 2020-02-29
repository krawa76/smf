## Provisioning

Login to AWS > EC2, create an instance:
- OS: ubuntu 18.04 or later
- type: e.g. t2.medium
- disk: e.g. 8Gb

If a web app deployment is planned, go to the EC2 instance security group, add the inbound rule: "custom TCP" - "TCP" - "port 80".


Install Docker:
```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo systemctl enable docker.service
sudo systemctl start docker.service
```

Re-login to your user account.

Install Docker Compose:
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```
More info here (see "Ubuntu" tab): https://docs.docker.com/compose/install/
