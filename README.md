# simple-spring-security
Completely Opinionated Spring Security Setup for Responsive Apps

This maven module can be used as a 'drop-in' spring security solution to support security apis for client access. It's particularly suited to angular, react and native development.

On the security side, it stores users, roles and hashed passwords in a database of your choice, leverages JWT bearer tokens and also provides a javascript library for authentication, authorisation, token refreshing and security management.

## Usage

### Installation
Clone this repository, cd into the newly cloned directory and build and install the code to your local maven repository
```
mvn install
```
Add this to your dependencies section in your pom.xml file:
```
<dependency>
    <groupId>com.cyphersys</groupId>
    <artifactId>simple-spring-security</artifactId>
    <version>1.0.0</version>
</dependency>
```
You need a database configured. If you are not using one already, set one up. Here is an example for a local postgres database:
```
# postgress
spring.jpa.generate-ddl=true
spring.jpa.open-in-view=true
spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=password
```
Then add something like the following to your application.properties file (changing the passwords as you go, then change them later as well once setup).

```
# The following settings configure the simple spring security subsystem. Many are optional
# jwtSecret (Optional) - If omitted the application will generate a new one on
# every restart. Specify a secret if you are using load balancing, or tools like kubernetes that handle 
# moving/recovering workloads. Use a random generator to create this. If using kubernetes or Docker Compose,
# you should really use secrets
com.cyphersys.security.jwtSecret=thisisjustalongkeythatneedstobereplacedinproductionsoitturnsoutitneedstobereallyreallylongtoworkhencethistextgoesonforawhilebutitneedstosothatthekeyislongenough
# jwtSecondsToLive (optional, default is 600 seconds). How long before a token times out.
com.cyphersys.security.jwtSecondsToLive=600
# roles - comma separated list of roles to setup the first time this is run. Optional, defaults to empty
# (no initial roles created except secadmin and admin if specified by admin.role)
com.cyphersys.security.defaults.roles=user,viewuser
# admin.role - optional, defaults to not creating an admin role or user if this and admin.name are not present.
com.cyphersys.security.defaults.admin.role=admin
# admin.name - optional, defaults to not creating an admin user if this and admin.role are not present.
com.cyphersys.security.defaults.admin.name=admin
# secadmin.password - Initial password created for the secadmin user
com.cyphersys.security.defaults.secadmin.password=happy123
# admin.password - Optional Initial password created for the admin user.
com.cyphersys.security.defaults.admin.password=happy123
# public-url-patterns - Optional comma separated list of quoted ant patterns for public urls.
# If missing, will use the following: "/api/security/public/**","/","/index.html","/static/**",
#                                     "/favicon.ico","/manifest.json","/logo*.png","/error"
com.cyphersys.security.public-url-patterns
```
Finally, locate your main spring boot application. Remove the @SpringBootApplication annotation and replace it with the following (replace your.package.name with, well, your package name).
```
@EnableAutoConfiguration
@ComponentScan({"your.package.name", "com.cyphersys.security"})
@Configuration
@EnableJpaRepositories({"your.package.name", "com.cyphersys.security"})
@EntityScan({"your.package.name", "com.cyphersys.security"})
```