
# The FishCatch API
#### by Niall Thurrat

#### HOSTED AT: https://fishcatch-api.herokuapp.com
#### SOURCE CODE: https://gitlab.lnu.se/1dv527/student/nt222fc/examination-2

## Examination 2 of 1dv527 (VT20)
#### The Web as an Application Platform

#### Project brief:
http://coursepress.lnu.se/kurs/the-web-as-an-application-platform/examination-2/


-----------------------------------------

## Test Instructions

Go to my gitlab project's postman folder at:
https://gitlab.lnu.se/1dv527/student/nt222fc/examination-2/-/tree/master/postman_test

Here you can get the 2 files needed to test my app in postman:
1. FishCatchAPI.postman_collection.json
2. FC_HEROKU_ENV.postman_environment.json

I have another ENV file in the postman_test folder for local testing so make sure you choose the right one! Import both files into the postman app and test away! There is some data added to the database already, so the user that signs up in the postman collection will already have fish in the database. The collection is designed to be ran in order (I use newman cli in my dev env). If you decide to run through the collection in order a second time, the only test that fails is the 'Correct Signup' request as the user is already in there.

-----------------------------------------

## Project Report

### Introduction: the problem I have tried to solve

The FishCatch API is dedicated to helping anglers record their caugth fish. This is the idea suggested by course responsibles, as follows. 

-- --------------
The fishing club "Den svartmunnade smörbultens banne" needs an API for collection fishing reports. They are thinking of building a client application but want a separate web API before taking this process along. The idea is that fishers should be able to report their catch and that this data could be made public. They want to collect data like:

* The user that catches the fish
* The position (longitude and latitude) of the catch
* Species
* Weight
* Length
* Timestamp of the catch

To do un-safe HTTP calls, the API must have Authentication/Authorization. A user should be able to sign in through the API in a safe way.
-- --------------

### QUESTION 1
Explain and defend your implementation of HATEOAS in your solution.

### ANSWER 1
I have chosen to use HAL as my hypermedia format to implement HATEOAS. My decision was largely based on the fact that I wanted something lightweight that was not just machine readable but quite easy to read for developers too. I really like the HAL standards syntax which has properties representing resource state, followed by links and embedded resources. I have included a 'description' property in each response which gives a bit of basic info to developers about the received resource and what options are now available from there. The link 'rels' inspired me to create some more detailed documentation which is served up by the API (e.g. https://api.host/docs/rels/user) and related to my more ad-hoc links. While maintenance of these docs could be troublesome and adds dev time to the project, I think it really helps make the API more discoverable to developers.

### QUESTION 2
If your solution should implement multiple representations of the resources. How would you do it?

### ANSWER 2
This would be acheived with content negotiation. At present my API only serves up Content Type application/hal+json, but I could also configure it to serve representations with other content types such as XML. I guess I would have to let developers know in the documentation that other options are available. Clients would use the Accept header to specify which content type they prefer to receive. An npm package such as jsontoxml would enable me to convert my current json response bodies into xml. I'm not sure exactly how this would be coded, but I assume my controllers could pick up on the Accept header in the request and return the appropriate representation.

### QUESTION 3
Motivate and defend your authentication solution.
1. What other authentication solutions could you implement?
2. What pros/cons do this solution have?

### ANSWER 3
I used passport local authentication and JSON Web Tokens to authenticate and authorize users in my solution. I wanted to use this to keep things simple as I was conscious that this was a university project and I didn't want to over complicate things. The other solution I considered was OAuth2 but it seemed to be more complicated to implement this as third parties were involved.

PROS
Using passport meant that a lot of the hard work was done for me, especially in relation to manging the JWT tokens. Once implemented it was really easy to asscess the 'user' on the request object using middleware that could be placed on which ever route I wanted. I was able to make my own authorization middleware specific to both fish and hook resources as well as the users' own fish collections.

CONS
After implementation of passport I then started to work on strengthening the validation of my users credentials which is something which must be robust. This was quite a bit of work. I also realized that I would need to handle password changes (not done yet) and all this would need to be documented to a certain degree. If I had of spent a little more time trying to figure out how to implement OAuth2, I could have had a third party do all that for me: it would have saved me a lot of work, provided safer validation and come with easily accessible and thourough documentation. 

### QUESTION 4
Explain how your webhook works.

### ANSWER 4
I have set up a webhook service which notifies FishCatch API users when a fish is added to the database. To do this I have created a hooks endpoint to manage POST, GET and DELETE requests for webhooks.  When users want to subscribe they must POST to the hooks endpoint with a body which contains a 'destination' field that states the URL that should receive the notifications. Users should be logged when subscribing as the route to the hooks endpoint requires authentication with a Bearer token received at login. POST requests with the appropriate 'destination' field and authentication will generate a Hook on the database. A key will be stored on the database as part of the Hook and FishCatch API uses a HMAC hexdigest of the key and body of hook notifications to create X-Hub-Signature headers so that the client can use their own key and validate that the hooks are coming from FishCatch API. GET methods to the hooks endpoint are a way for the client to retrieve the Hook details from FishCatch API and DELETE can be used to delete the Hook. Both also require user authentication. When a fish is added, the notifyHooks function checks the Hooks collection in MongoDB and issues a POST request including a payload and X-Hub-Signature to all subscribers.

### QUESTION 5
Since this is your first own web API, there are probably things you would solve in another way, looking back at this assignment. Write your thoughts about this.

### ANSWER 5
There are a lot of changes I would like to make to this API and I'll list a few below. I have had to simplify or omit a lot of functionality due to time constraints. Some changes that are needed are:

- AUTHENTICATION, AUTHORIZATION AND USER ACCOUNTS
I would use OAuth2 in future. I also need to facilitate a logout function server side, e.g. a blacklist for jwt tokens relating to logged out users. I also need to handle user resource editing and deletion.

- FISHCATCH DATA
Validation needs implemented for all FishCatch properties (a security risk at present).

- SORTING, FILTERING AND PAGINATION
I have provided sorting functionality on the 2 collection resources (fish and user-fish). I think i would like to use some sort of library for this to make it a bit tidier in future. I should also add filtering. I have used offset and limit query parameters to allow pagination on the client side, but I would like to setup pagination on the server side to make things easier for client developers.

- WEBHOOKS
I have implemented a very simple webhook which notifies subscribers when a fish is added. In an API which is being used be large numbers of users it would be a strain on my API to continue to serve up this many notifications, and they wouldn't be particularly useful in reality. I would therefore develop the function to have a series of hooks, such as hooks when a record fish is entered (i.e. the biggest trout), when a particular species is caught or even when a fish is caught in a users own area. This would involve adding webhook 'types' to the Hooks on the database, and a bit of filtering before choosing who to notify about particular events. I am also aware that there needs to be some some of mechanism for removing webhooks that are not being used. This could be achieved, e.g. by requiring 200 OK response within 10 seconds of issueing notifications.

- DOCUMENTATION
There's a lot of hard coded information in my docs resources. With more time I would definitely like to add a lot more dynamic data into these docs to make them easier to maintain.

- CLIENT APP
I would like to set up a simple client app (didn't feel I had time). I believe this would help me better understand how the HAL links can be used as machine discoverable information. It would also help when developing webhooks.

- PRODUCTION
I've just used a free tier Heroku account to put my app online which would need changed to something more appropriate for production. I'm also just hooked up to the same db I've used in testing. I would need to link to a separate one that's suitable for prod as well. As Heroku free apps use the herokuapp.com domain, https is supported but http is allowed too. I therefore have simply set up middleware to internally redirect all http requests to https. If this were not a demo API, I would purchase a custom domain from Heroku which would automatically manage TLS certificates for the site (if I actually decided to use Heroku).

### QUESTION 6
Did you do something extra besides the fundamental requirements? Explain them.

### ANSWER 6
I created my own documentation resources which was not something I envisaged doing at the beginning of the project. This was because I was trying to accurately follow the HAL standard but I'm glad I done it as its a nice way to improve human discoverability of the API, even though it created quite a bit of extra work for me. One downside of this is that it will require extra work to maintain in future, although this should could mitigated by addition of more dynamic content as opposed to the hard coding I've done. I also created a user-fish resource which essentially can be achieved by filtering data using a query parameter on the fish collection resource but I thought it would make things easier for client developers to provide this service to users as well as improving machine discoverability of it as a separate resource.
