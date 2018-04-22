Levantar el proyecto!


Primero hacer npm install 

Instalar sequelize-cli en forma global
npm install -g sequelize-cli

Instalar sequelize en forma global
npm install -g sequelize

Instalar el módulo mysql en forma global
npm install -g mysql2

Instalar el módulo nodemon en forma global
npm install -g nodemon

## Configuración de ambiente

Es necesario contar con dos archivos de configuración para los entornos de desarrollo y de ejecución de pruebas. Ambos deben estar en la raíz del proyecto.

- `.env`: Para desarrollo
- `.env.test`: Para ejecución de pruebas

Ambos deben contar con el siguiente formato

```sh
TOKEN_SECRET=<valor>
DB_CONNECTION=<connection_string>
URL_FRONT=<url>
```
Por ejemplo
```sh
TOKEN_SECRET="mySecret"
DB_CONNECTION=mysql://root:root@database:3306/parlamentapp
URL_FRONT=http://localhost:3020
```


Migracion de BD
    Debe estar creada la estructura inicial de la BD. Para ello se usan las migrations de sequilize
    Ademas para las migraciones la configuracion de que directorios se usan se encuentra en .sequelizerc.js

    Para crear la estructura inicial ejecutar el comando
        sequelize db:migrate

    Para insertar algunos datos base de ejemplo ejecutar
        sequelize db:seed:all

        Revisar el directorio de la carpeta seed para ver que se creo

    Para borrar la db y poder empezar de nuevo, ejecutar
        sequelize db:migrate:undo:all
    Para borrar el ultimo migration, ejecutar
        sequelize db:migrate:undo

Ejecucion de test
    Para ejecutar los test, puede que la base de datos ya este creada o no, si esta creada borrarla
        sequelize db:migrate:undo --env=test

    Crear la bd
        sequelize db:migrate --env=test

    Ejecutar los tests con npm
        npm run tests


Ejecutar la app
    Ejecutar usando npm
        npm start

    Descripcion de la api
        La intencion es mostrar como asegurar y utilizar la API. Se exponen algunas que son publicas y otras privadas

        GET /api/usuarios es publica

        GET /api/usuarios/:id es privada y pedira autenticacion

        Para autenticar

        POST /api/token con un body {"username": "user@example.com", "password": "foobar"}

        Lo que devuelve dentro de token debe insertarse como header en los request que requieren autenticacion. Por ejemplo en el header debe decir
        Content-Type: application/json
        authorization: ACA_EL_TOKEN 

Seguridad de la API
    El token tiene dentro los permisos del usuario.
    En cada request se puede validar que el usuario tenga un permiso en particular.
    Para usarlo se puede hacer por ejemplo en un archivo de rutas lo siguiente
        var authMiddleware = require('../../auth/middleware')
        let validateAdminPermissions = authMiddleware.checkIsLoggedWithPermission('VER_USUARIO')
        let validateLoggedUser = authMiddleware.checkIsLoggedWithPermission()

    Luego en las rutas en particular: 

        /* Esto seria una api sin ninguna seguridad */
        router.get('/', function (req, res, next) {
            ... contenido
        })

        /* Esto seria una api que pide un permiso en particular, en este caso "VER_USUARIO" */
        router.get('/:user_id', validateAdminPermissions, function (req, res, next) {
            ... contenido    
        })

        /* Esto seria una api que solo pide que exista el token, pero ningun permiso en particular */
        router.get('/:user_id/roles', validateLoggedUser, function (req, res, next) {
            ... contenido
        })


Debug la app
    Para debuggear con los chrome tools, se puede usar el node --inspect
    Para ello ejecutar el comando 
        npm run debug
    seguir las instrucciones que indica la consola

