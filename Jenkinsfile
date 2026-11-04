pipeline {
    agent any

    triggers {
        // Step 1: Poll GitHub repository every 2 minutes for automatic triggers
        pollSCM('H/2 * * * *')
    }

    environment {
        APP_NAME       = 'devops-web-app'
        CONTAINER_NAME = 'devops-local-app'
        HOST_PORT      = '8081'
        CONTAINER_PORT = '80'
    }

    stages {
        // -------------------------------------------------------------
        // STEP 1: Jenkins pulls code automatically from GitHub
        // -------------------------------------------------------------
        stage('Step 1: Pull Code from GitHub') {
            steps {
                echo '=== [STEP 1] Pulling latest code from GitHub repository ==='
                checkout scm
                sh '''
                    echo "Checking cloned workspace files:"
                    ls -la
                '''
            }
        }

        // -------------------------------------------------------------
        // STEP 2: Build Docker Image and Push to Docker Hub
        // -------------------------------------------------------------
        stage('Step 2: Build Docker Image') {
            steps {
                echo '=== [STEP 2.1] Building Docker image ==='
                sh '''
                    docker build -t ${APP_NAME}:latest -t ${APP_NAME}:${BUILD_NUMBER} .
                    echo "Docker image built successfully: ${APP_NAME}:latest"
                '''
            }
        }

        stage('Step 2: Push to Docker Hub') {
            steps {
                echo '=== [STEP 2.2] Pushing image to Docker Hub ==='
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
                            sh '''
                                echo "Logging in to Docker Hub as $DH_USER..."
                                echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin

                                FULL_IMAGE="$DH_USER/${APP_NAME}"
                                docker tag ${APP_NAME}:latest "${FULL_IMAGE}:latest"
                                docker tag ${APP_NAME}:latest "${FULL_IMAGE}:${BUILD_NUMBER}"

                                echo "Pushing ${FULL_IMAGE}:latest to Docker Hub..."
                                docker push "${FULL_IMAGE}:latest"
                                docker push "${FULL_IMAGE}:${BUILD_NUMBER}"

                                echo "SUCCESS: Image pushed to Docker Hub -> ${FULL_IMAGE}:latest"
                            '''
                        }
                    } catch (Exception e) {
                        echo "⚠️ Docker Hub credentials ('dockerhub-creds') not yet configured in Jenkins."
                        echo "To enable push: Add 'dockerhub-creds' (Username with password) in Jenkins -> Manage Jenkins -> Credentials."
                        echo "Proceeding with local deployment test..."
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // STEP 3: Deploy Image locally and verify accessible on localhost
        // -------------------------------------------------------------
        stage('Step 3: Deploy Container Locally') {
            steps {
                echo '=== [STEP 3] Deploying Docker container locally ==='
                sh '''
                    echo "Stopping any existing container named ${CONTAINER_NAME}..."
                    docker stop ${CONTAINER_NAME} || true
                    docker rm -f ${CONTAINER_NAME} || true

                    echo "Starting container on localhost:${HOST_PORT}..."
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        ${APP_NAME}:latest

                    echo "Waiting for container startup..."
                    sleep 2
                '''
            }
        }

        stage('Step 3: Verify Localhost Access') {
            steps {
                echo '=== [STEP 3] Verifying accessibility on localhost ==='
                sh '''
                    echo "Checking container status:"
                    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"

                    echo "Testing HTTP response from http://localhost:${HOST_PORT}/..."
                    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${HOST_PORT}/" || echo "000")
                    echo "HTTP Status Code: ${HTTP_STATUS}"

                    if [ "${HTTP_STATUS}" -eq 200 ]; then
                        echo "SUCCESS: Application is live and accessible at http://localhost:${HOST_PORT}/"
                    else
                        echo "FAILED: HTTP status returned ${HTTP_STATUS} (Expected 200)"
                        docker logs --tail 30 ${CONTAINER_NAME}
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            echo "CI/CD Pipeline Completed Successfully! Application live at http://localhost:${HOST_PORT}"
        }
        failure {
            echo "Pipeline Failed! Please review the console output for errors."
        }
    }
}
