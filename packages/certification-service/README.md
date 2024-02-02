<!--
SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX

SPDX-License-Identifier: Apache-2.0
-->

<p align="right">
    <a href="CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg" alt="Code of conduct"></a>
</p>

<p align="center">
    <h1 align="center">Microservice</h1>
    <p align="center">The microservice responsible for getting a grade for each API.</p>
    <p align="center"><strong><a href="https://inditextech.github.io/api-scoring-doc/scoring-system/microservice/)">Learn more in the doc!</a></strong></p>
    <br>
</p>

This folder contains the **API Scoring microservice** and its API. The structure is the following:

```bash
└─ certification-service/
    └─ code/
      └─ config/
      └─ protolint_custom_rules/ # These rules are only available via API Hub extension. Here lay our custom rules in a binary format for every major platform/architecture.
      └─ scripts/
      └─ src/
        └─ controllers/
        └─ evaluate/ # A representation of the available rulesets and code to call each utility.
        └─ format/
        └─ log/
        └─ middleware/
        └─ routes/
        └─ rules/ # Rules and configuration files for all the utilities (Spectral, markdownlint, and protolint) that the microservice leverages to certificate.
        └─ scoring/
        └─ usecase/
        └─ utils/
        └─ verify/
        └─ main.js
```

## How to run the scoring service

1. Clone the repository:

```
  git clone git@github.com:InditexTech/api-scoring-engine.git
```

2. Place yourself in the correct package:

 ```
  cd packages/certification-service/code/
 ```

3. Install the dependencies:

 ```
 npm i
 ```

4. Optionally, add your GitHub credentials in one of the following ways to be able to validate private repositories:

   - as environment variables:

         CERWS_GH_USERNAME (GitHub username)
         CERWS_GH_PASSWORD (GitHub personal access token)

   - or in the [`configmap.yml` file](code/config/configmap.yml):

      ```yml
      cerws:
        common:
          rest:
            client:
              github-rest-client:
                username: <GITHUB_USERNAME>
                password: <GITHUB_PERSONAL_ACCESS_TOKEN>
      ```

5.  Optionally, if you want to use references to external schemas with secured urls you can configure the authentication header:

    - as environment variable:

          CERWS_RESOLVER_AUTH_HEADER: Bearer your_token

6. Once the process finishes, start the service:

 ```
 npm run start
 ```

<br>

## Usage

[View the documentation](https://inditextech.github.io/api-scoring-doc/scoring-system/microservice/) for usage information.
