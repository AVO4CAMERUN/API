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
>	"name": "....",
>	"surname": "....",
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


GET {base_URL}/api/v1/account
> Request
> Restituisce tutti gli account con tutte le loro informazioni

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

GET {base_URL}/api/v1/account/:email
> Request
> Restituisce l'account corrispondenet all'email

> Responce
>```json
>{
>		"userData": "..."
>}	
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found

GET {base_URL}/api/v1/account **?firstname=[name1, nameN]&lastname=[name1, nameN]&role=[role1, roleN]&id_class=[id1, id2]**
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

PUT {base_URL}/api/v1/account/**:email**
> Request
>	Parameter type for json request:
>	- role
>	- firstname
>	- lastname
>	- password
>	- profile_img
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
>	"newAllDataUser": "...",
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non è il tuo account


DELETE {base_URL}/api/v1/**account**
> Request
>```
> Authorization: Bearer <token>
>```
>Non che bisogno di un codice perche l'autenticazione avviene tramite jwt
>Solo un propritario di account puo eliminarlo

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: token scaduto
>   - NNN &#8594; hai gia eliminato un account
***

GET {base_URL}/api/v1/account/**:confirmAccountCode**

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

GET {base_URL}/api/v1/account/**:confirmDeleteCode** 	//aggiungere la conferma per l'elimina
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
>	"students": [...], (email)
>	"profs": [...]	(email forse da cambiare in id, piu performante)
>}
>```

> Responce
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)

GET {base_URL}/api/v1/classes **?name='[name1, nameN]'&email_profs='[email1, emailN]&email_student='[email1, emailN]'**
	
> Request
>

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error

GET {base_URL}/api/v1/classes/**:class_id** (nome non unique)
> Request
>

> Responce
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error

PUT {base_URL}/api/v1/classes/**:class_id**
> Request
>```
> Authorization: Bearer <token>
>```
>```json
>{
>	"newDataUser":"..."
>}
>```

> Responce
>```json
>{
>	"newAllDataUser":"..."
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei tu il tutor professore
>   - 404 &#8594; Not Found


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
***

### invitations


***

### Courses

POST    {base_URL}/api/v1/**courses**

> Request
>```
> Authorization: Bearer <token>
>```
>```json
>{
>	"name": "....",
>	"description": "....",
>	"subject": [...],
>	"img_cover": [...]	
>}
>```

> Responce
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri (forse da specificare meglio)


GET {base_URL}/api/v1/courses/**:course_id**
> Request
>```
>Free request
>```

> Responce
>```json
>{
>		"name": "...", 
>		"description": "...",
>		"creation_date": "...",
>		"subject": "...",
>		"img_cover": "..."		
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error


GET {base_URL}/api/v1/**courses** 
(Non so se utile, restituisce un vettore di tutti i corsi)

GET {base_URL}/api/v1/classes **?firstname=[name1,nameN]&lastname=[name1,nameN]&role=[role1,roleN]&class_id=[id1,id2]**


PUT {base_URL}/api/v1/courses/**:parameter**

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


DELETE {base_URL}/api/v1/courses/**:course_id**

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
***

#### Units

POST    {base_URL}/api/v1/**units**

> Request
>```
> Authorization: Bearer <token>
>```
>```json
>{
>	"name": "....",
>	"description": "....",
>	"id_course": "....",
>}
>```

> Responce
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri

GET {base_URL}/api/v1/courses/:course_id/**units**
> Request
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

DELETE {base_URL}/api/v1/units/**:unit_id**
> Request
>```
> Authorization: Bearer <token>
>```
>```json
>{
>	"course_id": "..."
>}
>```

>Responce
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 404 &#8594; Not found
>	- 403 &#8594; Forbidden:
***

#### Lessons

POST {base_URL}/api/v1/**lessons**
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
>	"quiz": {....}
>}
>```

> Responce
>
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri

PUT {base_URL}/api/v1/lessons/**:lesson_id**
> Request
>```json
>{
>	"course_id": "...",
>	"unit_id": "...",
>	"newLessonData": "..."
>}
>```

> Responce
>```json
>{
>	"newAllDataLesson": "..."
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden 	
>	- 404 &#8594; Not Found 	

DELETE {base_URL}/api/v1/lessons/**:lesson_id**
> Request
>```
> Authorization: Bearer <token>
>```
>
>
> Responce
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 404 &#8594; Not Found
***

#### Exercise

POST {base_URL}/api/v1/**exercises**
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
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri 


PUT {base_URL}/api/v1/exercises/**:exercise_id**
> Request
>```json
>{
>	"course_id": "...",
>	"unit_id": "...",
>	"newExerciseData": "...."
>}
>```

> Responce
>```json
>{
>	"newAllDataExercise": "..."
>}
>```
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden 	
>	- 404 &#8594; Not Found 

DELETE {base_URL}/api/v1/exercises/**:exercise_id**
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
>	Status code:
>	- 200 &#8594; Ok
>	- 500 &#8594; Server error
>	- 403 &#8594; Forbidden: non sei un professore
>   - 400 &#8594; Errore nei parametri
***
