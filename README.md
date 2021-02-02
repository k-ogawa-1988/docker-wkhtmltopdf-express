# docker-wkhtmltopdf-express

## Prerequisites

* Docker

## Build docker container

```bash
yarn
yarn run build
```

## Run in docker

```bash
docker run -p 5001:5001 docker-wkhtmltopdf-express
```

### From HTML body

POST `http://localhost:5001/html` with HTML body to get PDF binary based on the input HTML.

### From URL

POST `http://localhost:5001/url` with JSON body `{"url": "http://www.example.com"}` to get PDF binary based on the URL.

### Query string

* `orientation`
    * `portrait` (default)
    * `landscape`
* `size`
    * `A0`
    * `A1`
    * `A2`
    * `A3`
    * `A4` (default)
    * `A5`
    * `A6`
    * `A7`
    * `A8`
    * `A9`
    * `B0`
    * `B1`
    * `B2`
    * `B3`
    * `B4`
    * `B5`
    * `B6`
    * `B7`
    * `B8`
    * `B9`
    * `B10`
    * `C5E`
    * `Comm10E`
    * `DLE`
    * `Executive`
    * `Folio`
    * `Ledger`
    * `Legal`
    * `Letter`
    * `Tabloid`

## Known issues

* Some HTML crashes the express server (and be killed forcibly) even it catches errors
