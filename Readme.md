# Levantar el proyecto utilizando docker

El proyecto consta de las siguientes partes:
  - Backend Node.js
  - Frontend React.js 
  - Base de datos postgres


Todas las partes son levantadas en conjunto utilizando docker-compose. A continuación se explica cómo se configuran.

Puede llegar a suceder un error en alguno de los contenedores la primera vez que se levante el proyecto ya que la BD no existe y de error. Hay que tener la BD bien configurada.

## Ejemplo de docker-compose
Todo el tutorial está escrito suponiendo que existe un *docker-compose.yml* dentro de una carpeta en donde en un directorio superior se encuentran descargados los repositorios del frontend y del backend. Se tendría entonces un archivo con caracteristicas similares al siguiente:
```yml
version: '3'
services:
  nodeBack:
    image: node-back
    container_name: nodeBack
    ports:
      - "3050:3000"
      - "3051:3001"
      - "9229:9229"
    volumes:
      - ../node_back/apinode:/usr/src
    links:
     - mysql:database
  nodeFront:
    image: node-front
    container_name: nodeFront
    ports:
      - "3020:3000"
      - "9220:9229"
    volumes:
      - ../node_front/apinode:/usr/src
  mysql:
    image: mysql:5.5
    container_name: mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: "root"

```
Como se puede ver, hay 3 servicios.

## BD
Uno de los servicios que se levanta es la base de datos. Es importante que luego en los servicios que necesiten de la misma exista un link para que puedan encontrarla.

Por ejemplo con esta configuración desde el backend una forma válida de conectarse sería: 
```json
{
    "development": {
      "username": "root",
      "password": "root",
      "database": "apinode",
      "host": "database",
      "dialect": "postgres",
      ...
    },
    ...
}
```
Vale la pena aclarar que el nombre de host es lo que se le ponga en *docker-compose.yml* como alias al servicio en el link.

Como se mencionó anteriormente, al levantar la app de backend, va a tratar de conectarse a esta base de datos que probablmenete la primera vez no exista. Algo que se puede hacer es levantar la primera vez solo el servicio de BD, ahí crear la BD correspondiente y luego si levantar todo.


##  BACKEND

Para levantar el backend se utiliza un contenedor basado en la imagen representada por el archivo *dockerfile-node*.

El mismo esta basado en node  8.9.0 e instala además algunas dependencias que necesita el proyecto.

Crea además un directorio /usr/src en el cual al momento de levantar el contenedor debe apuntar al codigo fuente.

Entonces se debe construir esta imagen utilizando un comando como por ejemplo:
```sh
$ docker build --rm --no-cache -t node-back -f dockerfile-node . 
```

Con lo anterior se creará una imagen llamada **node-back**.

En el docker-compose entonces tenemos que utilizar esta imagen, anteriormente ya se mostró un ejemplo de un archivo yml representando este caso.

Al levantar el contenedor se ejecutará el comando:
```sh
$ npm run start-dock
```
El mismo lo que hace es un npm install y además corre con nodemon el proyecto, por lo que se estarán eschuchando cambios.

Por defecto la app corre en el puerto 3000 del contenedor, para utilizarla obviamente se debe utilizar el puerto que se haya configurado en el forwarding, en nuestro caso el 3050.

### Conectarse al contenedor

Para conectarse al contenedor y disponer de una consola se debe ejecutar el siguiente comando:
```sh
$ docker exec -ti nodeBack /bin/bash
```
Esto automaticamente ingresará a la carpeta /usr/src del contenedor.

### Debug con chrometools
Para poder debuggear se debe ingresar a una consola del contenedor y una vez dentro ejecutar:
```sh
$ npm run debug
```
Esto arrancará la app en modo inspect en otro puerto, por defecto el 3001, que también fue configurado con forwarding en el docker-compose, por ejemplo en nuestro caso si con chrome accedemos al puerto 3051 vamos a poder debuggear utilizando las devtools.
