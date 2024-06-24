# Trainings App

All shell scripts are developed for Linux Mint and might not run on other Operating Systems

## Start

frontend: npm start
backend: sudo ./backendStart.sh

## Prerequisites
- python3
- node 12.22.9
- docker compose
  
## Initial Setup for Linux Mint
- Sudo apt update
- Sudo apt upgrade -y
- curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

- git clone https://github.com/zapZarapAnzeige/trainingsApp.git
- cd [path]/backend
- sudo ./installBackend.sh
- sudo ./startBackend.sh
- cd ../frontend
- npm install
- npm start
