
# The FishCatch API
#### by Niall Thurrat  

HOSTED AT: https://fishcatch-api.herokuapp.com *  
SOURCE CODE: https://github.com/niall-thurrat/fishcatch-api

## A university project
Linnaeus University: The Web as an Application Platform (1dv527): Examination 2

## What is FishCatch API?
The FishCatch REST API is a web app that manages user and caught fish resources. Client apps can access the API using JWT authentiaction to provide CRUD functionality to users who want to keep track of caught fish data. FishCatch API has been created to complete [an assignment for Linnaeus University](https://github.com/niall-thurrat/fishcatch-api/tree/master/docs/assignment.md).

-----------------------------------------

## How to Test FishCatch API

Go to my GitHub project's postman folder at:
https://github.com/niall-thurrat/fishcatch-api/tree/master/postman_test

Here you can get the 2 files needed to test my app in postman:
1. FishCatchAPI.postman_collection.json
2. FC_HEROKU_ENV.postman_environment.json

I have another ENV file in the postman_test folder for local testing so make sure you choose the right one! Import both files into the postman app and test away! There is some data added to the database already, so the user that signs up in the postman collection will already have fish in the database. The collection is designed to be ran in order (I use newman cli in my dev env). If you decide to run through the collection in order a second time, the only test that fails is the 'Correct Signup' request as the user is already in there.

-----------------------------------------

* FishCatch API has been created as part of a university project and is accessible online for demo purposes only.
