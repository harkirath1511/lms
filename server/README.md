# GDSC LMS Backend

This is the backend service for the GDSC Learning Management System.

## Containerization with Docker


### Environment Variables
Before running the application, create an `.env` file in the root directory 
Then edit the `.env` file with your actual configuration values.

### Running with Docker

#### Build and start the containers
```bash
docker-compose up -d
```
The `-d` flag runs the containers in detached mode (in the background).

#### View logs
```bash
docker-compose logs -f
```

#### Stop the containers
```bash
docker-compose down
```

#### Rebuild the containers (after making changes)
```bash
docker-compose up -d --build
```

### Docker Configuration Details

- The application runs on port 3000 by default (configurable via PORT environment variable)
- MongoDB runs as a separate container and is accessible at mongodb://mongodb:27017/gdsc-lms
- Container data is persisted using Docker volumes

### Development with Docker

When developing, you can use the volume mounts to reflect code changes without rebuilding:

```bash
docker-compose up
```

Any changes you make to the code will be reflected in the running container.

## Without Docker (Local Development)

```bash
# Install dependencies
npm install

# Run in development mode
npm run server

# Run in production mode
npm start
```
