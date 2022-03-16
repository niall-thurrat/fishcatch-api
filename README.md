# The FishCatch API
**by Niall Thurrat**  

HOSTED AT: https://fishcatch-api.herokuapp.com  
SOURCE CODE: https://github.com/niall-thurrat/fishcatch-api

_NB: FishCatch API has been created as part of a university project and is accessible online for demo purposes only._

## a university project

[Linnaeus University]( https://lnu.se/en/): The Web as an Application Platform (1dv527): Examination 2

## What is FishCatch API?

The FishCatch REST API is a web app that manages user and caught fish resources. Client apps can access the API using JWT authentiaction to provide CRUD functionality to users who want to keep track of caught fish data. FishCatch API has been created to complete [an assignment for Linnaeus University](https://github.com/niall-thurrat/fishcatch-api/tree/master/docs/assignment.md).

At present, users can record the following data about their fish:

- catcher username
- catch latitude
- catch longitude
- species
- weight
- length

## FishCatch API endpoints

Requests to each endpoint receive responses with HAL formatted body content, making the API endpoints machine readable. Developers also benefit from the response details as well as accompanying documents for each endpoint, served up as resources by the API as well.

|  Resource  |  URL  |  Doc URL  |  
|  ---------  |  ------------  |  -------  |  
|  root  |  {{HOST}}  |  -  |  
|  signup  |  {{HOST}}/users/signup  |  {{HOST}}/docs/rels/signup  |  
|  login  |  {{HOST}}/users/login  |  {{HOST}}/docs/rels/login  |
|  user  |  {{HOST}}/users/:username  |  {{HOST}}/docs/rels/user  |
|  user-fish  |  {{HOST}}/users/:username/user-fish  | {{HOST}}/docs/rels/user-fish  |
|  all-fish  |  {{HOST}}/fish  | {{HOST}}/docs/rels/all-fish   |
|  one-fish   |  {{HOST}}/fish/:fishId  |  {{HOST}}/docs/rels/one-fish  |
|  hooks |  {{HOST}}/hooks  |  {{HOST}}/docs/rels/hooks  |

## Check out the API

The easiest way to take a look at FishCatch’s REST API responses is to import the following two documents into [Postman](https://learning.postman.com/docs/postman/sending-api-requests/requests/): 

1. FishCatchAPI.postman_collection.json
2. FC_HEROKU_ENV.postman_environment.json

These are found in my GitHub project's [postman_test](https://github.com/niall-thurrat/fishcatch-api/tree/master/postman_test) folder. You can then try out the various endpoints from there. Remember you’ll need to start with sign-up and login first, but after that you can check out the resources in no particular order.

## How to Test FishCatch API

Follow the advice above in section ‘Check out the API’, then use the ‘Run Collection’ feature in Postman to test the deployed app.

If you do decide to clone the fishcatch-api repo for some bizarre reason, then go ahead and get npm package newman installed. Then you just need to run the ‘npm run newman’ script while the server is running to test the app locally.
