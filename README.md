# REST API

### Root api
<!--
GET     {base_URL}/api/v1/
POST    {base_URL}/api/v1/  
PUT 
DELETE
<mark>forse fare conferma anche per delete account</mark>
-->
***

### Account 

{base_URL}/api/v1/**account**

POST

> Request
>```json
>{
>	"username": "....",
>	"password": "....",
>	"email": "example@example.com"
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: users gia preso
>   - NNN &#8594; hai gia un account


DELETE  

> Request
>```
> Authorization: Bearer <token>
>```
>Non che bisogno di un codice perche l'autenticazione avviene tramite jwt

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: token scaduto
>   - NNN &#8594; hai gia eliminato un account


{base_URL}/api/v1/account/**:parameter**

qui aggingere si dei filtri

GET
> Request
>	Parameter type:
>	- email
>	- username
>	- role
>	- firstname
>	- lastname
>	- registration_date

> Responce
>```json
>[
>	{
>		"oneUserData": "..."
>	},
>	{
>		"TwoUserData": "..."
>	},
>	...
>]
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found


{base_URL}/api/v1/account/**:email/new_users_data**

PUT
> Request
>```json
>{
>	"newDataUser":"..." 
>}
>
>```
>L'account viene identificato tarmite l'email, che non verra mai cambiata.
>i campi non esistenti o impostati a undefined vengono ignorati

> Responce
>```json
>{
>	"data": "...",
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non è il tuo account
***

{base_URL}/api/v1/account/**:confirmCode**

GET

> Request
>```
> Confirm code: codice generato casualmete univoco temporizzato per confermare 
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 401 &#8594; Unauthorized: codice sbagliato
>   - 500 &#8594; Server error
(forse unificare le richieste per creare e delete account distringerle tramite programma)
***


#### Student

{base_URL}/api/v1/account/students/**:parameter**

GET
> Request
>	Parameter type:
>	- class_name
>   - class_id
>```json
>{
>	"data": "...",
>}
>```

> Responce
>```json
>{
>	"data": "...",
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found


#### Prof

{base_URL}/api/v1/account/profs/**:parameter**

GET 

> Request
>	Parameter type:
>	- class_name
>   - class_id
>```json
>{
>	"profData": "...",
>	"classes": [...]
>}
>```

> Responce
>```json
>{
>	"data": "...",
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found
***

### Login

{base_URL}/api/v1/**login**

POST 

> Request
>```json
>{
>	"username": "....",
>	"password": "...."
>}
>```

> Responce
>```json
>{
>	"accessToken": "....",
>	"refreshToken": "...."
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: Passwors or email err						

PUT
> Request
>```json
>{
>	"refreshToken": "...."
>}
>```

> Responce
>```json
>{
>	"newAccessToken": "....",
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: token non valido 						

DELETE

> Request
>```json
>{
>	"refreshToken": "...."
>}
>```

> Responce
>	Status code:
>	- 200 &#8594; Ok
>	- 403 &#8594; Forbidden: fake token 						
***

### Classes

{base_URL}/api/v1/classes/:class_data

POST

> Request
>```
> Authorization: Bearer <token>
>```
>```json
>{
>	"name": "....",
>	"img_cover": "....",
>	"startStudent": [],
>	"startProf": []
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)

{base_URL}/api/v1/classes/**:class_name**

DELETE

> Request
>```
> Authorization: Bearer <token>
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)


{base_URL}/api/v1/**classes**

PUT 

> Request
>```json
>{
>	"newDataUser":"..." 	
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei tu il tutor professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)

{base_URL}/api/v1/classes/**:email_profs**

GET

> Request
>```json
>{
>	"name": "....",
>	"img_cover": "....",
>	"startStudent": [],
>	"startProf": []
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)

(filter da decicere numero studenti regex ecc)

***

### Courses

POST    {base_URL}/api/v1/**courses**
(usare le pccole post delle unita, lesson, exe..)

PUT     {base_URL}/api/v1/courses/**:parameter**

PUT
> Request
>	Parameter type:
>	- id
>	- name
>```
> Authorization: Bearer <token>
>```
>```json
>{
>	"newCoursesData": "...."
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden 	
>	- 404 &#8594; Not Found 			
***

{base_URL}/api/v1/courses/**:name**

DELETE

> Request
>```
> Authorization: Bearer <token>
>```
>Non che bisogno di un codice perche l'autenticazione avviene tramite jwt

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: token scaduto
>   - 404 &#8594; Not found: il corso non esiste


{base_URL}/api/v1/courses/**:parameter**

GET
> Request
>	Parameter type:
>	- id
>	- name
>
>```
>Free request
>```

> Responce
>```json
>{
>	coursesSimpleData: {
>		"name": "...", 
>		"description": "...",
>		"creation_date": "...",
>		"subject": "...",
>		"img_cover": "..."		
>	},
>	units:[
>		{
>			"name": "...",
>			"description": "...",
>			"lessons": [
>						{
>						   "name": "....",
>						   "creation_date": "....",
>						   "link_video": "...",
>						   "quiz":{...}	
>						},								
>						...
>						],
>			"exercises": [
>							{
>							   "name": "....",							
>							   "creation_date": "....",
>							   "exercise":{...}
>							},								
>							...
>						]
>		},
>		....
>	   ]
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found:


{base_URL}/api/v1/courses/**:parameter**

GET
> Request
>	Parameter type:
>	- id
>	- name
>	- email_creator
>	- creation_date
>	- suject

> Responce
>```json
>[
>	{
>		"courseData": "..."
>	},
>	{
>		"courseData2": "..."
>	},
>	...
>]
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found
***

#### Units

{base_URL}/api/v1/courses/:courses_parameter/**units**

GET
> Request
>	Courses parameter type:
>	- id
>	- name

> Responce
>```json
>
>[
>	{
>		"name": "...",
>		"description": "...",
>		"lessonsAndExercise": [
>			"{base_URL}/api/v1/courses/:id/units/lessons/{id}",
>			"{base_URL}/api/v1/courses/:id/units/lessons/{id..}",
>			"{base_URL}/api/v1/courses/:id/units/exercise/{id..}",
>			...
>		]
>	},
>	...
>]
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden:
>	- 404 &#8594; Not found


DELETE
> Request
>```
> Authorization: Bearer <token>
>```
>DELETE di tutte le unita di un corso
>
>	Courses parameter type:
>	- id
>	- name
>```

>Responce
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found
>	- 403 &#8594; Forbidden:


{base_URL}/api/v1/courses/:course_parameter/units/**:unit_parameter**

DELETE 
> Request
>	Courses parameter type:
>	- id
>	- name
>
>	Units parameter type:
>	- id
>	- name

> Responce
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden:
>	- 404 &#8594; Not found
***


#### Lessons

{base_URL}/api/v1/courses/:courses_parameter/units/units_parameter/**lessons**

POST
> Request
>```
> Authorization: Bearer <token>
>```
>	Courses parameter type:
>	- id
>	- name
>
>	Units parameter type:
>	- id
>	- name
>
>```json
>{
>	"name": "....",
>	"link_video": "....",
>	"quiz": {....},
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)


{base_URL}/api/v1/courses/:courses_parameter/units/units_parameter/lessons/**:lesson_parameter**

GET
> Request
>	Courses parameter type:
>	- id
>	- name
>
>	Lessons parameter type:
>	- id
>	- name

> Responce
>```json
>{
>	"name": "....",
>	"link_video": "....",
>	"quiz": {....},
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found


DELETE
> Request
>```
> Authorization: Bearer <token>
>```
>	Courses parameter type:
>	- id
>	- name
>
>	Units parameter type:
>	- id
>	- name

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)

PUT
> Request
>```json
>{
>	"newLessonData": "...."
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden 	
>	- 404 &#8594; Not Found 			
***

#### Exercise

{base_URL}/api/v1/courses/:courses_parameter/units/units_parameter/**exercise**

POST
> Request
>```
> Authorization: Bearer <token>
>```
>	Courses parameter type:
>	- id
>	- name
>
>	Units parameter type:
>	- id
>	- name
>
>```json
>{
>	"name": "....",
>	"description": "....",
>	"filemd": {....},
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)

		
{base_URL}/api/v1/courses/:courses_parameter/units/units_parameter/exercise/**:exercise_parameter**

GET
> Request
>	Courses parameter type:
>	- id
>	- name
>
>	Exercise parameter type:
>	- id
>	- name

> Responce
>```json
>{
>	"name": "....",
>	"description": "....",
>	"filemd": {....},
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found


DELETE
> Request
>```
> Authorization: Bearer <token>
>```
>	Courses parameter type:
>	- id
>	- name
>
>	Units parameter type:
>	- id
>	- name

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
> - 400 &#8594; Errore nei parametri (forse da specificare meglio)

PUT
> Request
>```json
>{
>	"newExerciseData": "...."
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden 	
>	- 404 &#8594; Not Found 			
***
