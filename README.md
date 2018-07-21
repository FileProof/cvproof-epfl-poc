# esther

## Introduction
[CVProof.com](http://cvproof.com) Proof-of-Concept developed in collaboration with EPFL Research Institute and university in Lausanne, Switzerland to demonstrate a basic credential validation.

## Process
a) Requestor uploads a document (can be an academic certificate) to validate.
b) Validator (can be the University) checks the document and can modify the document.
c) Validator confirms the validation.
d) The document can be modified after validation.
e) Check detects if in step d) above the document has been modified in comparing proof of validation c) above sealed in the blockchain.

## Installation

* Install dependencies: `npm install`
* Run the server in _debug_ mode: `DEBUG=esther:* npm start`
* Run the server in _auto-reload_ mode with `nodemon`: `nodemon --debug`

## Semantic

We use [Semantic UI](https://semantic-ui.com) as front-end framework. 

Semantic configuration is defined in `semantic.json`.

Semantic provides a [theming](https://semantic-ui.com/usage/theming.html) feature to customize appearance of the global interface and individual components. All of the theming definitons take place in the `semantic/` folder.

To build Semantic output files: `cd semantic` and `gulp build`. Output files (`css` and `js`) are automatically moved to the app static files directory (`public/semantic/`).
