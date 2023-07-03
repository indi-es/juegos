# Juegos

La información en esta página fue recopilada originalmente en su mayoría por [Cataxis](https://www.flowcode.com/page/cataxis).

- Base de datos original en [Google Docs](https://docs.google.com/spreadsheets/d/1qZNjZOXthLsm_NQynQ2VOPgVUMK6hfAuLeTj1HG-bV0/edit#gid=1938942876)

Este trabajo está licenciado con la [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## ¿Cómo utilizo este repositorio?

Si lo único que quieres es la base de datos en formato JSON, puedes descargar el archivo en [Github](https://github.com/indi-es/juegos/blob/main/data.json)

Si lo que quieres es ver la información en una tabla junto con algunas gráficas, puedes hacerlo en la página de [INDI·ES](https://indi-es.com/juegos)

### Setup

Si lo que quieres es usar el scrapper (Bajar la información de Google Docs y convertirlo a JSON) necesitas lo siguiente:

- Tener Instalado Node y NPM o Yarn
- Obetener un GOOGLE API KEY, si tines dudas de como hacerlo primero intenta con la [documentación de Google](https://cloud.google.com/docs/authentication/api-keys)
- Un archivo llamado `.env` en la carpeta `./.github/actions` dentro de este repositorio
- En el archivo `.env` agrega la información de tu API KEY con el siguiente formato

```
GOOGLE_API_KEY="TU API KEY"
```

- Corre el comando `yarn install` o `npm install` dentro del folder `./.github/actions` para instalar las dependencias.

### Scrap

Ya instaladas las dependencias, puedes correr el comando `yarn build` o `npm run build` dentro del folder `./.github/actions` para obtener la última información de Google Docs y escribirlo en el archivo `./data.json`

Si quieres cambiar el rango de la hoja de Google Docs, en el archivo `./.github/actions/gen-from-gdocs.js` cambia la variable `sheetRange`.

Si quieres checar que juegos de la lista están en Itch.io y no tienen información sobre con que están hechos, puedes correr el comando `node ./get-engines-from-itch.js` dentro del folder `./.github/actions`