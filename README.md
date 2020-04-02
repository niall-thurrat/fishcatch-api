
# The FishCatch API
#### by Niall Thurrat

## Examination 2 of 1dv527 (VT20)
#### The Web as an Application Platform

#### Project brief:
http://coursepress.lnu.se/kurs/the-web-as-an-application-platform/examination-2/


-----------------------------------------

## Test Instructions

-----------------------------------------

## Project Report

### Introduction: the problem I have tried to solve

The FishCatch API is dedicated to helping anglers record their caugth fish. This is the idea suggested by course responsibles, as follows. 

-- --------------
The fishing club "Den svartmunnade smörbultens banne" needs an API for collection fishing reports. They are thinking of building a client application but want a separate web API before taking this process along. The idea is that fishers should be able to report their catch and that this data could be made public. They want to collect data like:

The user which catches the fish
* The position (longitude and latitude) of the catch
* Specie of the fish
* Weight
* Length
* Timestamp of the catch

To do un-safe HTTP calls, the API must have Authentication/Authorization. A user should be able to sign in through the API in a safe way.
-- --------------

### QUESTION 1
Explain and defend your implementation of HATEOAS in your solution.

### ANSWER 1
I have chosen to use HAL as my hypermedia format to implement HATEOAS. My decision was largely based on the fact that I wanted something lightweight that was not just machine readable but quite easy to read for developers. I really like the syntax which has properties representing resource state, followed by links and embedded resources which conform to the HAL standards. I have included a 'description' property in each response which gives a bit of info about the recived resource and what options are now available to the client developer. This is just for easier 'at-a-glance' reading and is not actually needed. The 'rel' links of links inspired me to create some basic documentation which is served up by the API (e.g. https://api.host/docs/rels/user) and related to my more ad-hoc links. While maintenance of these docs could be troublesome and it adds dev time to the project, I think it really helps make the API more discoverable to developers.

### QUESTION 2
If your solution should implement multiple representations of the resources. How would you do it?

### ANSWER 2
This would be acheived with content negotiation. At present my API only serves up Content Type application/hal+json, but I could also configure it to serve representations with other content types such as XML. I guess I would have to let developers know in the documentation that other options are available. Clients could then use the Accept header to specify which content type they prefer to receive. An npm package such as jsontoxml would enable me to convert my current json response bodies into xml. I'm not sure exactly how this would be coded, but I assume my controllers could pick up on the Accept header in the request and return the appropriate representation.

### QUESTION 3
Motivate and defend your authentication solution.
1. What other authentication solutions could you implement?
2. What pros/cons do this solution have?

### ANSWER 3
I used passport local authentication and JSON Web Tokens to authenticate and authorize users in my solution. I wanted to use this to keep things simple as I was conscious that this was a university project and I didn't want to over complicate things. The othe solution I considered was OAuth2 but it seemed to be more complicated to implement this as third parties were involved.

PROS
Using passport meant that a lot of the hard work was done for me, especially in relation to manging the JWT tokens. Once implemented it was really easy to asscess the user on the request object using middleware that could be placed on which ever route I wanted and the Authorization headers were taken care of in my responses. I was able to make my own authorization middleware specific to both fish resources and the users own fish collection.

CONS
After implementation of passport I then started to work on strengthening the validation of my users credentials which is something which must be robust. This was quite a bit of work. I also realized that I would need to handle password changes (not done yet) and all this would need to be documented to a certain degree. If I had of spent a little more time trying to figure out how to implement OAuth2, I could have had a third party do all that for me: it would have saved me a lot of work, provided safer validation, and come with easily accessible and thourough documentation. 

### QUESTION 4
Explain how your webhook works.

### ANSWER 4
bla

### QUESTION 5
Since this is your first own web API, there are probably things you would solve in another way, looking back at this assignment. Write your thoughts about this.

### ANSWER 5
bla

### QUESTION 6
Did you do something extra besides the fundamental requirements? Explain them.

### ANSWER 6
Not really, I pretty much stuck to the suggested problem in the brief. I suppose I could have got by with less sorting functionality, so that was nice to include (although I'm sure with more time an npm package would have been adopted for more options, especially filtering). I also created my own documentation which was not something I envisaged doing at the beginning of the project. This was because I was trying to accurately follew the HAL standard but I'm really glad I done it as its a really nice way to improve human discoverability of the API.

