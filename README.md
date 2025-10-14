# Azure Static Web App

Questa repository contiene un esempio basilare di Azure Static Web App (nello specifico di una *Single Page Application*).

La soluzione realizzata si propone di esporre un frontend che permette un login ed a seguito del login eseguire due attività: upload di un file su storage account e interrogazione di  una istanza AI.
Il login è possibile appoggiandosi alle informazioni presenti in un indice Elasticsearch.

La soluzione completa si basa su due repository:

- *questa* in cui è possibile trovare il codice del frontend, le modalità di test e deploy del frontend ed il deploy delle risorse su Azure
- [Azure Function Backend](https://github.com/..) in cui è possibile trovare il codice di backend per interrogare le varie risorse e dare funzionalità al frontend.