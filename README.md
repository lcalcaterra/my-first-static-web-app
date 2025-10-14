# Azure Static Web App

Questa repository contiene un esempio basilare di Azure Static Web App (nello specifico di una *Single Page Application*).

La soluzione realizzata si propone di esporre un frontend che permette un login ed a seguito del login eseguire due attività: upload di un file su storage account e interrogazione di  una istanza AI.
Il login è possibile appoggiandosi alle informazioni presenti in un indice Elasticsearch.

La soluzione completa si basa su due repository:

- *questa* in cui è possibile trovare il codice del frontend, le modalità di test e deploy del frontend ed il deploy delle risorse su Azure
- [Azure Function Backend](https://github.com/..) in cui è possibile trovare il codice di backend per interrogare le varie risorse e dare funzionalità al frontend.

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
