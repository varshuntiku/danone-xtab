import logging


def add_certificates(cert: str):
    """
    Function to add custom certificates to certifi CA bundle.

    Parameters
    ----------
    cert: str, Path to the certificate file in PEM format. Supports .cer, .crt, .pem

    Returns
    -------
    str, A message of success/exists.
    """
    try:
        import certifi
    except Exception as e:
        logging.error(e)
        raise ImportError("""Certifi is not installed. Install it using 'pip install certifi'""")

    import pathlib

    # cert_path = pathlib.Path(cert)
    cert_path = pathlib.Path(cert).absolute()

    # if cert_path.is_file() and cert_path.is_absolute():
    if cert_path.is_file():
        if any(ext in cert_path.as_uri() for ext in [".pem", ".crt", ".cer"]):
            nuclios_certificates_context = open(cert_path).read()
            ssl_certificates_context = open(certifi.where()).read()
            if nuclios_certificates_context not in ssl_certificates_context:
                with open(file=certifi.where(), mode="a") as append_file:
                    append_file.write(nuclios_certificates_context)

                return "Cerificates Added Succesfully"
            else:
                return "Certificates Already Added"
        else:
            raise ValueError(
                "Provided cert doesn't match a valid certificate(PEM) format, give either a .cer, .crt, .pem"
            )
    else:
        raise ValueError("Provided cert is not a valid file path.")


if __name__ == "__main__":
    import argparse

    # Create an argument parser
    parser = argparse.ArgumentParser(description="Add Nuclios Certificates")

    # Define command-line arguments
    parser.add_argument(
        "--cert",
        dest="cert_path",
        required=True,
        help="Path to the certificate file in PEM format. Supports .cer, .crt, .pem",
    )

    # Parse the command-line arguments
    args = parser.parse_args()

    # Call the function with named arguments
    cert_call = add_certificates(cert=args.cert_path)
    print(cert_call)
