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

POST {base_URL}/api/v1/**account**



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


DELETE {base_URL}/api/v1/**account**

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

GET {base_URL}/api/v1/account
GET {base_URL}/api/v1/account/:email

GET {base_URL}/api/v1/account **?firstname='[name1, nameN]'&lastname='[name1, nameN]'&role='[role1, roleN]'&classid='[id1, id2]'**

> Request
>	Parameter type:
>	- role
>	- firstname
>	- lastname
>i parametri non specificati sarranno undefined è quindi non verranodo considerati

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


PUT {base_URL}/api/v1/account/**:email**

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

GET {base_URL}/api/v1/account/**:confirmCode**

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

### Login

POST {base_URL}/api/v1/**login**

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

PUT {base_URL}/api/v1/**login**

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

DELETE {base_URL}/api/v1/**login**

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

POST {base_URL}/api/v1/classes

> Request
>```
> Authorization: Bearer <token>
>```
>```json
>{
>	"name": "....",
>	"img_cover": "....",
>	"student": [...], (email)
>	"profs": [...]	(email cambiare in id)
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)


DELETE {base_URL}/api/v1/classes/**:class_id**

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


PUT {base_URL}/api/v1/classes/**:class_id**

> Request
>```
> Authorization: Bearer <token>
>```
>```json
>{
>	"newDataUser":"..." (inviare solo cose da cambiare e restituire dati nuovi)
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei tu il tutor professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)


GET {base_URL}/api/v1/classes/**:class_id**
(nome non unique)

GET {base_URL}/api/v1/classes **?name='[name1, nameN]'&email_profs='[email1, emailN]&email_student='[email1, emailN]'**

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

DELETE {base_URL}/api/v1/courses/**:name**



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

GET {base_URL}/api/v1/courses/:course_id/**units**

> Request
>
>

> Responce
>```json
>[
>	{
>		"name": "...",
>		"description": "...",
>		"lessons": [
>			{
>				"name": "....",
>				"link_video": "....",
>				"quiz": {....},
>			},
>			...
>		],
>		"exercise":[
>			{
>				"name": "....",
>				"description": "....",
>				"filemd": {....}
>			},
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

DELETE {base_URL}/api/v1/courses/:course_id/units/**:unit_id**

> Request
>```
> Authorization: Bearer <token>
>```
>DELETE di una delle unita di un corso
>
>```

>Responce
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found
>	- 403 &#8594; Forbidden:
***

#### Lessons

POST {base_URL}/api/v1/lessons

> Request
>```
> Authorization: Bearer <token>
>```

>```json
>{
>	"course_id": "...",
>	"unit_id": "...",
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



DELETE {base_URL}/api/v1/lessons/:lesson_id

> Request
>```
> Authorization: Bearer <token>
>```
>```json
>{
>	"course_id": "...",
>	"unit_id": "..."
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)


PUT {base_URL}/api/v1/lessons/:lesson_id

> Request
>```json
>{
>	"course_id": "...",
>	"unit_id": "...",
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

POST {base_URL}/api/v1/exercises

> Request
>```
> Authorization: Bearer <token>
>```

>```json
>{
>	"course_id": "...",
>	"unit_id": "...",
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

DELETE {base_URL}/api/v1/exercises/:exercise_id

> Request
>```
> Authorization: Bearer <token>
>```
>```json
>{
>	"course_id": "...",
>	"unit_id": "..."
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)

PUT {base_URL}/api/v1/exercises/:exercise_id

> Request
>```json
>{
>	"course_id": "...",
>	"unit_id": "...",
>	"newExercisesData": "...."
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
