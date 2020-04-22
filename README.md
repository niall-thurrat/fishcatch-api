
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
