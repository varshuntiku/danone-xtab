# Base image
FROM postgres:11.21-alpine

LABEL maintainer=shridhar@themathcompany.com
LABEL org=mathco
LABEL platform=codex
LABEL product=postgres
LABEL image_type=platform_image

# Install Dependencies
RUN apk add clang15
RUN apk add git
RUN apk add build-base
RUN apk add llvm15-dev

WORKDIR  /home
RUN git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git
WORKDIR  /home/pgvector
RUN make
RUN make install

# Add SQL files
ADD codex_database.sql /
ADD codex_product_database.sql /
ADD codex_test_database.sql /

# Expose the PostgreSQL port
EXPOSE 5432

# Add VOLUMEs to allow backup of config, logs, and databases
VOLUME ["/var/log/postgresql", "/var/lib/postgresql/data"]
RUN chown -R postgres:postgres /var/log/postgresql /var/lib/postgresql/data
RUN chmod -R 755 /var/log/postgresql /var/lib/postgresql/data

ENV POSTGRES_USER=db_user
ENV POSTGRES_PASSWORD=p@ssw0rd
ENV POSTGRES_MULTIPLE_DATABASES=codex,codex_product,codex_test

# Add initialization script to create multiple databases
ADD create_multiple_databases.sh /docker-entrypoint-initdb.d