# simple-spring-security
Completely Opinionated Spring Security Setup for Responsive Apps

This maven module can be used as a 'drop-in' spring security solution to support security apis for client access. It's particularly suited to angular, react and native development.

On the security side, it stores users, roles and hashed passwords in a database of your choice, leverages JWT bearer tokens and also provides a javascript library for authentication, authorisation, token refreshing and security management.

## Usage

Add something like the following to your application.properties file:

```
# postgress
spring.jpa.generate-ddl=true
spring.jpa.open-in-view=true
spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=password

# Security settings
com.cyphersys.security.jwtSecret=thisisjustalongkeythatneedstobereplacedinproductionsoitturnsoutitneedstobereallyreallylongtoworkhencethistextgoesonforawhilebutitneedstosothatthekeyislongenough
com.cyphersys.security.jwtSecondsToLive=600
com.cyphersys.security.defaults.roles=user,viewuser
com.cyphersys.security.defaults.admin.role=admin
com.cyphersys.security.defaults.admin.name=admin
com.cyphersys.security.defaults.secadmin.password=changeMePls
com.cyphersys.security.defaults.admin.password=andMeTooPls
```
