Shared Server

Dado que se requiere poseer varios Application servers (por ejemplo, estas pueden ser instancias del mismo servicio por zona geográfica o distintas apps de una misma empresa que interactuan entre sí), AppMaker© nos solicita que se desarrolle un servidor encargado de la administración de Application servers. Además este servidor será el encargado de brindar servicios de uso común: autenticación, login y administración de archivos.

El objetivo de la administración de application servers es el de conocer el estado y el uso de los estos. Para esto el Shared Server deberá consultar a los application servers, registrados previamente, para conocer datos acerca del uso del mismo.

Componentes

El Shared Server deberá tener una interfaz de usuario WEB orientado a usuarios de negocio quienes principalmente utilizaran el sistema para poder ver estado de cada Application Server. Los usuarios finales nunca utilizaran esta plataforma, ya que solo utilizaran el cliente Android el cual se comunica con su Application Server. Esta interfaz WEB deberá mostrar la actividad de los diferentes Application Server en diferentes gráficos.

El mismo deberá ser implementado utilizando NodeJS para el desarrollo de la API y Angular 2/4 o ReactJS para el desarrollo de la aplicación web. Además se deberá utilizar Postgresql como base de datos.

Para que los Application Servers puedan comunicarse se deberá implementar una API común (Restful API [1]). Los Application Servers se limitarán a utilizar dicha API para interactuar con el Shared Server. La interfaz web de este último podrá utilizar endpoints no definidos en la misma. De esta manera se asegurará la interoperabilidad con las diferentes implementaciones de Application Server.

Servicio de administración de app server

Este servicio permitirá registrar un app server. Esto devolverá un token que podrá ser utilizado para interactuar con los demás servicios.

Servicio de reportes

Servicio que mostrará estádisticas y datos de uso acerca de los application servers.

Servicio de estado actual

Servicio que podrá visualizar el estado actual de todos los application servers corriendo. Se valora el uso de gráficos.

Servicio para administración de archivos

Servicio que permitirá administrar los archivos que contiene el shared server (alta, listado, baja). Para poder administrar los archivos se deberá utilizar el token provisto por el shared server durante el proceso de registración.

Cada archivo deberá contener la siguiente metadata asociada:

Nombre de archivo
Tamaño del archivo
Fecha de subida
Este servicio deberá devolver, entre sus datos, la url que permite acceder a este de forma remota.

Servicio de autenticación (login)

Este servicio permitirá a los usuarios poder ingresar al sistema, obteniendo un token que deberá ser utilizado por los demás servicios.

Servicio de registro

Este servicio permitirá a los usuarios darse de alta en el sistema.