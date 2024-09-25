#!/usr/bin/env bash
apt-get update && apt-get install -y apt-transport-https unixodbc-dev curl gnupg software-properties-common
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list | tee /etc/apt/sources.list.d/msprod.list
apt-get update && apt-get install -y msodbcsql18
