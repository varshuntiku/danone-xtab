pushing image to acr

1. podman build -t dsstore-backend-dev:latest .
2. podman tag dsstore-backend-dev:latest  acrinnovation.azurecr.io/dsstore-backend-dev:latest
3. az acr login -n acrinnovation --expose-token
4. podman push acrinnovation.azurecr.io/dsstore-backend-dev:latest --creds=00000000-0000-0000-0000-000000000000:token_generated_in_previous_command