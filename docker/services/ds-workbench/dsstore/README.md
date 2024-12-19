# For creating Package
python setup.py sdist bdist_wheel
or
poetry build

# Publishing package in artifact store
twine upload -r codex_feed dist/* --config-file ./.pypirc

# pushing image to acr
podman build --no-cache -t mathcodex.azurecr.io/jupyterhub-user-default:latest .
podman push mathcodex.azurecr.io/jupyterhub-user-default:latest

# UML generatetion
pyreverse -o png -p . dsstore
