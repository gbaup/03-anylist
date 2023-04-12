<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Dev

1. Clonar proyecto.
2. Copiar el `.env.template` y renombrarlo a `.env`.
3. Ejecutar:

```
npm i
```

4. Levantar la imagen (Docker desktop):

```
docker-compose up -d
```

5. Levantar el backend de nest:

```
npm run start:dev
```

6. Visitar el sitio:

```
localhost:3000/graphql
```

7. Ejecutar la mutation "seed" para llenar la base de datos. Leer descripción para agregar más items.
8. Para más información sobre el funcionamiento de la API, leer el archivo <a href="https://imagenes-reclamos.s3.amazonaws.com/api-graphql.pdf">api-graphql</a>
