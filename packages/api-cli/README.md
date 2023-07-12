<!--
SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX

SPDX-License-Identifier: Apache-2.0
-->

<p align="right">
    <a href="CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg" alt="Code of conduct"></a>
</p>

<p align="center">
    <h1 align="center">API CLI</h1>
    <p align="center">Make requests to the certification system and get your API a grade.</p>
    <p align="center"><strong><a href="https://albalro.github.io/certification-system/cli/">Learn more in the doc!</a></strong></p>
    <br>
</p>

<br>

This folder contains the **API CLI**. The structure is the following:

```bash
└─ api-cli/
    └─ code/
      └─ commands/
    └─ config/
    └─ samples/
```

<br>

Once you install this CLI, you will be able to:

* [x] Verify if an API is well-designed.
* [x] Verify an API contract specification (OpenAPI, AsyncAPI, Avro, Protobuf Buffer) or the respective documentation files (Markdown).


<br>

## ⚙️ Installation and usage

1. You can start by cloning this repository: 

```bash
 git clone git@github.com:InditexTech/api-scoring-engine.git
```

2. Install the downloaded code dependencies:  

```bash
npm i
```

3. Link the 'apicli' command to local installation:

```bash
npm link
```

<br>

Then, you can use any of these commands: 

- `verify`, with which you can obtain the certification of the API, all along with some helpful information like version numbers or protocol. 

- `verify-file`, verifies an OpenAPI specification file.
- general and command-dedicated `help`, in case you need further information.

<br>

> Find more information and output examples in our [documentation](https://urban-adventure-29rymqv.pages.github.io/scoring-system/cli/)!
