agic_ingress_template = {
    "apiVersion": "networking.k8s.io/v1",
    "kind": "Ingress",
    "metadata": {
        "name": "",
        "namespace": "",
        "annotations": {
            "nginx.ingress.kubernetes.io/ssl-redirect": "false",
            "nginx.ingress.kubernetes.io/use-regex": "true",
            "appgw.ingress.kubernetes.io/backend-path-prefix": "/",
            "appgw.ingress.kubernetes.io/health-probe-status-codes": "200-399, 404",
        },
    },
    "spec": {
        "ingressClassName": "azure-application-gateway",
        "rules": [],
    },
}
