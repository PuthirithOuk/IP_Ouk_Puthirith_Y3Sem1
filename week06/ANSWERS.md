# Week 6 Answers

## 1. Is DELETE still idempotent?
Yes. Idempotent means that sending the same request several times leaves the
server in the same state as sending it once. After the first DELETE /events/2
the event is gone, and the second call changes nothing more, so the state is
the same. Only the response differs (204, then 404), and idempotency is about
the state of the server, not the status code.

## 2. CORS and curl
The browser blocks it. The server does answer, but the Vue app on port 5173
and the API on port 3000 are different origins, so the browser checks for an
Access-Control-Allow-Origin header and refuses to give the response to the
JavaScript if it is missing. curl is not a browser and does not enforce this
rule, so it prints the response anyway.

## 3. Who creates EventsService?
Nest's dependency injection container creates it. It reads the constructor
parameter types of EventsController, and builds the service when the
application starts (while the modules are initialized), then passes it in.
Only one instance is created, and it is shared by everything that asks for it,
including BookingsService.

## 4. The "booked": 50 request
The line `forbidNonWhitelisted: true` in the ValidationPipe options in
src/setup.ts refuses it with 400, because booked has no decorator in
CreateEventDto. Without it, `whitelist: true` would still strip the property
silently. Without both options, booked would reach the service and a client
could set how many seats are taken.

## 5. Where the "not enough seats" rule lives
The service holds the data and the rules, so every caller gets the same check,
and it can be tested without HTTP (the unit tests). The controller only maps
HTTP to service calls. The Vue form is not enough, because anyone can send a
request with curl and skip the form, and only the server knows the real
number of seats left. Checking and updating in one request on the server also
means the data can't end up half updated.