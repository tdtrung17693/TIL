---
id: t31gDGAToz1e3Y4j1QLg9c
title: Re-create container from fresh images
---




# Re-create container from fresh images

```bash
docker-compose rm -f
docker-compose pull
docker-compose up --build -d
```
