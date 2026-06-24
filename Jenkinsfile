pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "kavya1111999"
        FRONTEND_IMAGE = "kavya1111999/kavyagpt-frontend:v1"
        BACKEND_IMAGE = "kavya1111999/kavyagpt-backend:v1"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/thrilokchadalavada-1999/kavyagpt-ai-platform.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'docker build -t %FRONTEND_IMAGE% .'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'docker build -t %BACKEND_IMAGE% .'
                }
            }
        }

        stage('Push Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'

                    bat 'docker push %FRONTEND_IMAGE%'
                    bat 'docker push %BACKEND_IMAGE%'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s/'
                bat 'kubectl rollout restart deployment/kavyagpt-backend -n kavyagpt'
                bat 'kubectl rollout restart deployment/kavyagpt-frontend -n kavyagpt'
            }
        }
    }
}