#!/bin/bash

docker run -d \
  --name oms-mock-backend \
  -p 8001:8001 \
  oms-backend
