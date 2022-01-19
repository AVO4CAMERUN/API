# REST API

### Root api
GET     {base_URL}/api/v1/
POST    {base_URL}/api/v1/  
PUT 
DELETE

### Account

POST    {base_URL}/api/v1/account  
DELETE  {base_URL}/api/v1/account  (Non che bisogno di un codice perche che Auth  => forse fare conferma da email)
GET     {base_URL}/api/v1/account/:confirmCode

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

### Login

POST    {base_URL}/api/v1/login  
DELETE  {base_URL}/api/v1/login
PUT     {base_URL}/api/v1/login 

### Users
POST    {base_URL}/api/v1/users     (Da vedere con account)

GET     {base_URL}/api/v1/users/:email
GET     {base_URL}/api/v1/users/:username
GET     {base_URL}/api/v1/users/:role
GET     {base_URL}/api/v1/users/:firstname
GET     {base_URL}/api/v1/users/:lastname
GET     {base_URL}/api/v1/users/:registration_date
GET     // magari farli misti o unirli

PUT     {base_URL}/api/v1/users/:email/new_users_data (cambia tutto tranne email)

DELETE  {base_URL}/api/v1/users

#### Student
GET     {base_URL}/api/v1/users/students/:class_name

#### Prof
GET     {base_URL}/api/v1/users/profs/:class_name
GET     {base_URL}/api/v1/users/profs/:class_name/:role

### Classes

POST    {base_URL}/api/v1/classes/:class_data  
POST    {base_URL}/api/v1/classes/:email_creator 

DELETE  {base_URL}/api/v1/classes/:class_name 
DELETE  {base_URL}/api/v1/classes/:email_creator  

PUT     {base_URL}/api/v1/classes

GET  {base_URL}/api/v1/classes/:email_creator
GET  {base_URL}/api/v1/classes/:email_creator/:(filter da decicere numero studenti regex ecc)

### Courses

POST    {base_URL}/api/v1/courses
PUT     {base_URL}/api/v1/courses/:name
PUT     {base_URL}/api/v1/courses/:email_creator/:id

DELETE  {base_URL}/api/v1/courses/:name
DELETE  {base_URL}/api/v1/courses/:email_creator 

GET     {base_URL}/api/v1/courses/

GET     {base_URL}/api/v1/courses/:id
GET     {base_URL}/api/v1/courses/:name
GET     {base_URL}/api/v1/courses/:email_creator
GET     {base_URL}/api/v1/courses/:email_creator/:suject
GET     {base_URL}/api/v1/courses/:creation_date
GET     {base_URL}/api/v1/courses/:suject

### Units

POST    {base_URL}/api/v1/courses/:id/units
POST    {base_URL}/api/v1/courses/:name/units

DELETE  {base_URL}/api/v1/courses/:id/units/:id 
DELETE  {base_URL}/api/v1/courses/:name/units/:name


GET  {base_URL}/api/v1/courses/units/:id
GET  {base_URL}/api/v1/courses/units/:name
GET  {base_URL}/api/v1/courses/:id/units/:id 
GET  {base_URL}/api/v1/courses/:name/units/:name

### Lessons

POST    {base_URL}/api/v1/courses/:id/units/lessons
POST    {base_URL}/api/v1/courses/:name/units/lessons

DELETE  {base_URL}/api/v1/courses/:id/lessons/:id
DELETE  {base_URL}/api/v1/courses/:id/lessons/:name


GET  {base_URL}/api/v1/courses/:id/lessons
GET  {base_URL}/api/v1/courses/:name/lessons
GET  {base_URL}/api/v1/courses/:id/lessons/:id 
GET  {base_URL}/api/v1/courses/:name/lessons/:name

### Exercise

GET     {base_URL}/api/v1/
POST    {base_URL}/api/v1/  
PUT 
DELETE  