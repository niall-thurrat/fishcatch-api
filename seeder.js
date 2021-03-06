/**
 * Clears and seeds mongoDB database.
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 */

'use strict'

const mongoose = require('mongoose')
require('dotenv').config()
const FishCatch = require('./models/fishCatchModel')
const User = require('./models/userModel')

const dbUrl = process.env.MONGODB_URI ||
  process.env.DEV_MONGODB_URL

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

// connect to mongoDB via mongoose
mongoose.connect(dbUrl, dbOptions)
const connection = mongoose.connection

connection.once('open', function () {
  console.log(`MongoDB connection open: ${connection.db.databaseName}`)
  setDB()
})

async function setDB () {
  try {
    await clearDB()
    await seedFishCatchCollection()
    seedUserCollection()
  } catch (err) {
    console.log(err)
  } finally {
    console.log('db seed complete')
  }
}

async function clearDB () {
  try {
    await mongoose.connection.db.dropDatabase()
  } catch (err) {
    console.log(err)
  } finally {
    console.log(`${connection.db.databaseName} database dropped`)
  }
}

async function seedFishCatchCollection () {
  try {
    const fishData = [
      {
        catcherUsername: 'testNiall',
        catchLatitude: 123.4567,
        catchLongitude: 234.4567,
        species: 'trout',
        weight: 3.4,
        length: 34
      },
      {
        catcherUsername: 'testJoe',
        catchLatitude: 12.45367,
        catchLongitude: 2334.4567,
        species: 'zander',
        weight: 1.2,
        length: 23
      },
      {
        catcherUsername: 'testBob',
        catchLatitude: 456.4567,
        catchLongitude: 76.4567,
        species: 'char',
        weight: 4.4,
        length: 44
      },
      {
        catcherUsername: 'testBob',
        catchLatitude: 256.4567,
        catchLongitude: 736.4567,
        species: 'cod',
        weight: 2.3,
        length: 41
      },
      {
        catcherUsername: 'testBob',
        catchLatitude: 123.5678,
        catchLongitude: 345.4567,
        species: 'mullet',
        weight: 1.4,
        length: 24
      },
      {
        catcherUsername: 'testBob',
        catchLatitude: 123.4567,
        catchLongitude: 234.4567,
        species: 'flounder',
        weight: 0.4,
        length: 12
      },
      {
        catcherUsername: 'testBob',
        catchLatitude: 123.5678,
        catchLongitude: 345.4567,
        species: 'wrass',
        weight: 2.4,
        length: 29
      },
      {
        catcherUsername: 'testBob',
        catchLatitude: 123.4567,
        catchLongitude: 234.4567,
        species: 'gudgeon',
        weight: 0.17,
        length: 0.15
      },
      {
        catcherUsername: 'testBob',
        catchLatitude: 123.5678,
        catchLongitude: 345.4567,
        species: 'turbot',
        weight: 6.4,
        length: 22
      },
      {
        catcherUsername: 'testBob',
        catchLatitude: 123.4567,
        catchLongitude: 234.4567,
        species: 'salmon',
        weight: 17.9,
        length: 57
      }
    ]

    fishData.forEach(async function (value) {
      const fishCatch = new FishCatch(value)
      await fishCatch.save()
    })
  } catch (err) {
    console.log(err)
  } finally {
    console.log('fishcatches collection seeded')
  }
}

async function seedUserCollection () {
  try {
    const userData = [
      {
        name: 'Niall Test',
        username: 'testNiall',
        emailAddress: 'niallTest@test.com',
        password: 'T3stPassword1!'
      },
      {
        name: 'Joe Test',
        username: 'testJoe',
        emailAddress: 'joeTest@test.com',
        password: 'T3stPassword2!'
      }
    ]

    userData.forEach(async function (value) {
      const newUser = new User({
        name: value.name,
        username: value.username,
        emailAddress: value.emailAddress,
        password: value.password
      })
      await newUser.save()
    })
  } catch (err) {
    console.log(err)
  } finally {
    console.log('users collection seeded')
  }
}
