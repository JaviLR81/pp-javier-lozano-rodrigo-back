# NODE API-REST-MONGODB

#### Guías de desarrollo

- La carpeta **/classes** contiene el archivo server.ts, el cual es el encargado de crear el servidor de express, en esta clase se importa la conexión de base de datos hacia MongoDB.

- La carpeta **/database** contiene el archivo database.ts, el cual define la cadena de conexión hacia la base de datos en mongodb, para este ejemplo la base de datos se llama **dbUsers**.

- La carpeta **/dist** contiene el conjunto de clases compiladas hacia Javascript debido a que el proyecto esta escrito en typescript debe de compilarse para ser compatible con los navegadores.

- La carpeta **/models** contiene la clase User.ts en la cual se define el Schema y modelo requerido para la colección de users hacia mongodb, además de los métodos para encriptación y verificación de passwords mediante la librería bcryptjs.

- La carpeta **/routes** contiene el archivo router.ts en la cual se definen todos los endpoints de la apirest, junto con la lógica de cada uno, como en los ejemplos siguientes:

    POST-localhost:5000/login
    POST-localhost:5000/registerUser
    GET-localhost:5000/getUsers

- La carpeta **/token** contiene el archivo verifyToken.ts en el cual se define un método que analiza junto con algunas validaciones si el token enviado es válido, el header necesario para enviar el token es **x-access-token**.


#### Instrucciones

Reconstruir módulos de node
````
npm install
````

Generar el DIST con cualquiera de los siguientes comandos
````
npm run build
tsc -w
````

Levantar servidor con cualquiera de los siguientes comandos, el servidor se levanta en un entorno local en el puerto 5000 en caso fuese un servidor de producción por medio de la variable process.env.PORT tomariamos el puerto asignado en ese servidor, una vez levantado el proyecto podemos hacer consultas a el en la dirección:
localhost:5000.


````
npm run start
nodemon dist/
node dist/
````