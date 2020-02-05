## Provisioning

Login to AWS, create a virtual machine:
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
https://docs.docker.com/compose/install/
