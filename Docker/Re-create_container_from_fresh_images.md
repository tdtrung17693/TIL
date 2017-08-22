# Re-create container from fresh images

```bash
docker-compose rm -f
docker-compose pull
docker-compose up --build -d
```
