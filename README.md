# Repair Dash System - Backend part

The Repair Dash System backend is a sophisticated and scalable Node.js application, meticulously crafted using the Express framework, to serve as the backbone of a cutting-edge home appliance repair platform. This project, developed as part of the CMU-SE 451 Capstone Project 2 by a dedicated team, aims to revolutionize the way customers and repair service providers connect. The backend provides a comprehensive suite of APIs to manage user authentication, service listings, real-time chat functionality, order tracking, and administrative oversight. By integrating MySQL for robust structured data storage and Redis for caching JWT tokens, chat messages, and OTPs for secure password resets, the system ensures high performance, security, and reliability. This documentation will guide you through the installation, configuration, building with Docker, running locally, and highlight some of the standout features that make this backend a powerful solution for the Repair Dash System.

## Installation

To get started with the backend development environment, follow these steps to set up the project on your local machine:

1. **Clone the Repository**:
    Begin by cloning the project repository to your local environment:

    ```bash
    git clone https://github.com/qthiendev/Repair-Dash-System-BE.git
    cd Repair-Dash-System-BE
    ```

2. **Install Dependencies**:
    Install all required Node.js packages listed in the `package.json` file using npm:

    ```bash
    npm install
    ```

    This command will download dependencies such as Express, MySQL2, Redis, JWT, and others essential for the project's functionality.

## Configuration

Proper configuration is key to ensuring the backend operates smoothly with your local or production environment. Here’s how to set it up:

1. **Create Environment File**:
    Create a `.env` file in the root directory. If an `.env.example` file is provided, use it as a template. Otherwise, populate the `.env` file with the following variables:

    ```js
    PORT=3000
    CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
    NODE_ENV=development
    CORS_HTTP_ONLY=true
    DB_HOST=localhost
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_NAME=repair_dash
    DB_PORT=3306
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_PASSWORD=your_redis_password
    JWT_SECRET=your_very_secure_jwt_secret_key
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your_email@gmail.com
    SMTP_PASS=your_app_specific_password
    ```

    - Replace placeholders (e.g., `your_username`, `your_password`) with your actual database credentials.
    - Adjust `CORS_ORIGIN` to include all allowed origins for your frontend application.
    - For production, ensure sensitive data like `JWT_SECRET` and `SMTP_PASS` are securely managed.

2. **Database Setup**:
    - Install and start a MySQL server (e.g., MySQL Community Server).
    - Create a database named `repair_dash`.
    - Execute any SQL migration scripts or schema definitions provided in the project to set up the necessary tables (e.g., users, orders, services).

3. **Redis Setup**:
    - Install and run a Redis server locally.
    - Ensure the Redis host and port in the `.env` file match your setup.

## Building and Running with Docker

For a containerized deployment, Docker provides an efficient way to package and run the application. Follow these steps:

1. **Prerequisites**:
    - Install Docker and Docker Compose on your system.

2. **Build the Docker Image**:

    - Build the Docker image using the Dockerfile in the project root:

        ```bash
        docker build -t repair-dash-be .
        ```

3. **Run the Docker Container**:
    - Launch the container with the environment variables loaded from the `.env` file:

        ```bash
        docker run -p 3000:3000 --env-file .env repair-dash-be
        ```

    - The `-p 3000:3000` flag maps port 3000 on your host to port 3000 in the container.
    - Access the API at `http://localhost:3000`.

4. **Optional Docker Compose**:
    - If a `docker-compose.yml` file is included, you can use it to orchestrate the backend with MySQL and Redis services:

        ```bash
        docker-compose up --build
        ```

## Running Locally

For development purposes, you can run the backend directly on your machine:

1. **Start Dependencies**:
    - Ensure MySQL and Redis servers are running locally.
    - Verify database and Redis configurations match the `.env` settings.

2. **Run the Application**:
    - Start the server in development mode with automatic restarting on file changes:

        ```bash
        npm run dev
        ```

    - This uses Nodemon to monitor and restart the server as you make code changes.

    - For a production-like environment, run:

        ```bash
        npm start
        ```

3. **Test the API**:
    - Once the server is running, test the API endpoints at `http://localhost:3000/api` using tools like Postman or cURL.

## Cool Features

The Repair Dash System backend is packed with innovative features that enhance its functionality and user experience:

- **Real-time Chat System**: Leverages Redis to cache chat messages, enabling fast and efficient real-time communication between customers and stores. This feature supports the platform's goal of seamless interaction.

- **Secure Authentication and Authorization**: Implements JSON Web Tokens (JWT) with Redis caching for token management, ensuring secure user sessions. OTPs for password resets add an extra layer of security, aligning with modern authentication standards.

- **Scalable and Modular Architecture**: The backend is designed with containerized components (API Container, Middleware Container, Controllers Container, Services Container) as depicted in the architecture diagrams. This modularity allows for easy scaling and maintenance, supporting the Agile development approach outlined in the proposal.

- **Bad Word Filtering**: A custom middleware (`blockBadWords`) filters out inappropriate content, enhancing the platform's professionalism and user safety.

- **Graceful Shutdown Handling**: The application gracefully handles `SIGTERM` and `SIGINT` signals, ensuring clean closure of server processes and Redis intervals, which is critical for production stability.

- **Extensive API Coverage**: Supports a wide range of functionalities including payment management, order processing, profile management, and searching APIs, integrating with external systems like ZaloPay for payment processing.

- **Performance Optimization**: Utilizes Redis for caching critical data (e.g., JWT tokens, chat history), reducing database load and improving response times.

## Additional Tips

- **Logging**: The `terminal` utility provides detailed logs for server status and environment variables, aiding in debugging and monitoring.
- **Environment Flexibility**: The use of `dotenv` allows for easy switching between development, testing, and production environments.
- **Testing**: Run unit tests with Jest to ensure code quality:

  ```bash
  npm test
  ```

This backend serves as a solid foundation for the Repair Dash System, aligning with the project’s objectives to streamline home repair services and enhance user experience. For further details, explore the codebase and refer to the architecture diagrams provided.
