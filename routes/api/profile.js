// bring in dependencies

const express = require('express')
const router = express.Router()
// bring in auth since we will use it because the route is private(requires them to be signed in)
const auth = require('../../middleware/auth')
// bring in profile model to be used by router
const Profile = require('../../models/Profile')
// bring in user model to be user by router
const User = require('../../models/User')
// bring in express validator to use check when we run the create and update profiles route
const { check, validationResult } = require('express-validator')

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                               GET api/profile/me @@
// @Description              GET current User profile      @@
// @Access                                Private          @@ (because it is required they log in)
// user router when /me is called that has an asyc response that starts a try catch
router.get('/me', auth, async (req, res) => {
  try {
    // bring in profile model and user Find one by searaching user through req.user.id in order to find the user by id
    // comes in token
    // populate with name and avatar that come from User Model
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
    // if there is no profile
    if (!profile) {
      // respond with this error
      return res.status(400).json({ msg: ' there is no profile for this user ' })
    }
    // if there is an error
  } catch (err) {
    // log error message
    console.error(err.message)
    // log a status 500 and say sever error
    res.status(500).send('Server Error')
  }
})

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                               POST api/profile   @@
// @Description              creat or update user profile  @@
// @Access                                Private          @@
// creating the post route for / that usses the middleware in bracket of [auth and check], then has a asynch (req, res)
// that is async and will run a method inside of it to check the information comming in
router.post('/', [
  auth,
  [
    // checking to make sure that status is filled out using the rule that it is not empty
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty()
  ]
],
// this is an async
async (req, res) => {
// create a variable calle derrors that takes in the request and checks validation
  const errors = validationResult(req)
  // if errors variable is not empty then
  if (!errors.isEmpty()) {
    // then send the json array that describes the error to us
    return res.status(400).json({ errors: errors.array() })
  }

  // destructuring what is comming from the req.body
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body
  // build profile object
  // create profile fiends object
  const profileFields = {}
  // pulls user id from token we set up to send after login
  profileFields.user = req.user.id
  // will set profile fild.*whatever* to what is being pulled in from the request. we are checking to make sure its commin in
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername
  // need to turn skills into an array because it is comming in from the request as an array
  if (skills) {
    // set the profileFileds.skills to the array being brought in from the req
    // map through all the skills in the skill array and trim away any spaces before splitting
    // split up the skills array at each ',' using the .split('*were you want to make the split*')
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }

  // build social array
  // initializes profilefields.social
  profileFields.social = {}
  // assigns the social media value from the req to the profileFields.social.*whatever* we are checking to make sure its commin in
  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin
  if (instagram) profileFields.social.instagram = instagram
  // loging to server the skills
  console.log(profileFields.skills)
  // try to find user
  try {
    // set profile as the re.user.id that we pull from the req but make sure its async and we add the await
    let profile = await Profile.findOne({ user: req.user.id })
    // if the profile is found
    if (profile) {
      // set the profile to and updated value with the profile fields we have updated that come from the req
      // that we target with req.id
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      )
      // return the profile to json
      return res.json(profile)
    }
    // if profile is not found
    // set profile variable to newly created Profile object that has profile fields we created
    profile = new Profile(profileFields)
    // async await and save the newly created profile
    await profile.save()
    // respond with profile information
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error bro')
  }
})
// export
module.exports = router

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                                Get api/profile   @@
// @Description                          Get all profiles  @@
// @Access                                Public          @@
// that is async and will run a method inside of it to check the information comming in

router.get('/', async (req, res) => {
  try {
    // create profiles variable by looking for profile model and using the find method, add to the info brought in, the information
    // found in the profile model with the category of user, and bring name and avatar
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    // respond with information brought in by showing it in console as json file.
    res.json(profiles)
    // if cant get info coming and send json response of profiles then run this error
  } catch (err) {
    // console.log the error message
    console.error(err.message)
    // send status of 500 and send message to console
    res.status(500).send('Server Error not displaying profiles')
  }
})

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                  Get api/profile/user/:user_id   @@
// @Description                         Get profile by id  @@
// @Access                                Public           @@
// that is async and will run a method inside of it to check the information comming in

router.get('/user/:user_id', async (req, res) => {
  try {
    // create profiles variable by looking for profile model and using the find method, add to the info brought in, the information
    // found in the profile model with the category of user, and bring name and avatar
    // use findOne to find the user by the userid that is in the url in the request
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
    // if cant find user, send this message out
    if (!profile) return res.status(400).json({ msg: 'profile not found' })
    // respond with information brought in by showing it in console as json file.
    res.json(profile)
    // if cant get info coming and send json response of profiles then run this error
  } catch (err) {
    // console.log the error message
    console.error(err.message)
    // if the type of error is objectId then run this
    if (err.kind === 'objectId') {
      // respond with 400 status and a json message of profile not found
      return res.status(400).json({ msg: 'profile not found' })
    }
    // send status of 500 and send message to console
    res.status(500).send('Server Error not displaying profiles or invalid user object id')
  }
})

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                                Get api/profile   @@
// @Description            delete profile, user and posts  @@
// @Access                                Private          @@
// that is async and will run a method inside of it to check the information comming in
// need the auth because it is private and can only be done when logged in
router.delete('/', auth, async (req, res) => {
  // tries to remove profile and user
  try {
    // removes profile that is found by information comming in
    await Profile.findOneAndRemove({ user: req.user.id })
    // will remove user
    await User.findOneAndRemove({ _id: req.user.id })
    //
    res.json({ msg: 'User Removed!' })
    // look for if error happens
  } catch (err) {
    // if there is an error then run this
    console.error(err.message)
    // send status of 500 and send message to console
    res.status(500).send('Server Error')
  }
})

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                     Put api/profile/experience   @@
// @Description            add profile experience          @@
// @Access                                Private          @@
// that is async and will run a method inside of it to check the information comming in
// need the auth because it is private and can only be done when logged in
// will check to make sure title is not empty and if it is empty, say its required
// check for company also
// check for from date also

router.put('/experience',
  [
    auth,
    [
      check('title', 'Title is Required')
        .not()
        .isEmpty(),
      check('company', 'Company is Required')
        .not()
        .isEmpty(),
      check('from', 'from date is Required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // create error variable that holds if the token was validated
    const errors = validationResult(req)
    // if error is not empty
    if (!errors.isEmpty()) {
      // return 400 status and show errors array mesages
      return res.status(400).json({ errors: errors.array() })
    }
    // create constants that we will pull out of req.body
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body
    // set the constants that we created to the object of newExp
    // creates object with the data that the user submits

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }
    // run a try catch to find the user and update the profile
    try {
      // create profile const by pulling the info off the re.user.id (await is used since its async)
      // user find one to pull the profile in the id of the req.user that is in the token
      const profile = await Profile.findOne({ user: req.user.id })
      // add newExp object that was submited by the user to the FRONT of the experience list
      // by using the unshift function
      profile.experience.unshift(newExp)
      // save the change that we made to the profile
      await profile.save()
      // log out the newly edited profile in json so we can confirm its changed
      res.json(profile)
      // if an error is caught
    } catch (err) {
      // console the error message
      console.error(err.message)
      // response with 500 status and log server error
      res.status(500).send('Server Error')
    }
  })

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route         Delete api/profile/experience/:exp_id    @@
// @Description            Delete experience from profile  @@
// @Access                                Private          @@
// that is async and will run a method inside of it to check the information comming in
// need the auth because it is private and can only be done when logged in

router.delete('/experience/:exp_id', auth, async (req, res) => {
  // run try catch grab profile and right expereince to remove
  try {
    // console.log('testing')
    // create profile const by pullin info off req.user.id while using await since its async
    // user find one to pull the profile in the id of req.user that comes in the token (gets profile of logged in user)
    const profile = await Profile.findOne({ user: req.user.id })
    if (!profile) return res.status(400).json({ msg: 'profile not found' })

    // get remove index
    // removeIndex is what we are going to delete. and we find it by mapping through the profile.expereince
    // that we have found with our token and the id of the one we want to delete (the one that ends up being in the request)
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

    // then splice out the .experience from the profile, .spice(*what we are removing*, *how many we are removing*)
    profile.experience.splice(removeIndex, 1)

    // then save the profile after taking out the expereince
    await profile.save()

    // send updated profile to response in json format
    res.json(profile)
    // catch error if it happens because we can find the user
  } catch (err) {
    // console log the error message
    console.error(err.message)
    // send response status 500 and send server error to console
    res.status(500).send('Server Error')
  }
})

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                     Put api/profile/education    @@
// @Description            add profile education           @@
// @Access                                Private          @@
// that is async and will run a method inside of it to check the information comming in
// need the auth because it is private and can only be done when logged in
// will check to make sure title is not empty and if it is empty, say its required
// check for company also
// check for from date also

router.put('/education',
  [
    auth,
    [
      check('school', 'school is Required')
        .not()
        .isEmpty(),
      check('degree', 'degree is Required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'field of study is Required')
        .not()
        .isEmpty(),
      check('from', 'from date is Required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // create error variable that holds if the token was validated
    const errors = validationResult(req)
    // if error is not empty
    if (!errors.isEmpty()) {
      // return 400 status and show errors array mesages
      return res.status(400).json({ errors: errors.array() })
    }
    // create constants that we will pull out of req.body
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body
    // set the constants that we created to the object of newExp
    // creates object with the data that the user submits

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }
    // run a try catch to find the user and update the profile
    try {
      // create profile const by pulling the info off the re.user.id (await is used since its async)
      // user find one to pull the profile in the id of the req.user that is in the token
      const profile = await Profile.findOne({ user: req.user.id })
      // add newExp object that was submited by the user to the FRONT of the experience list
      // by using the unshift function
      profile.education.unshift(newEdu)
      // save the change that we made to the profile
      await profile.save()
      // log out the newly edited profile in json so we can confirm its changed
      res.json(profile)
      // if an error is caught
    } catch (err) {
      // console the error message
      console.error(err.message)
      // response with 500 status and log server error
      res.status(500).send('Server Error')
    }
  })

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route         Delete api/profile/experience/:edu_id    @@
// @Description            Delete education  from profile  @@
// @Access                                Private          @@
// that is async and will run a method inside of it to check the information comming in
// need the auth because it is private and can only be done when logged in

router.delete('/education/:exp_id', auth, async (req, res) => {
  // run try catch grab profile and right expereince to remove
  try {
    // console.log('testing')
    // create profile const by pullin info off req.user.id while using await since its async
    // user find one to pull the profile in the id of req.user that comes in the token (gets profile of logged in user)
    const profile = await Profile.findOne({ user: req.user.id })
    // if (!profile) return res.status(400).json({ msg: 'profile not found' })

    // get remove index
    // removeIndex is what we are going to delete. and we find it by mapping through the profile.expereince
    // that we have found with our token and the id of the one we want to delete (the one that ends up being in the request)
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

    // then splice out the .education from the profile, .spice(*what we are removing*, *how many we are removing*)
    profile.education.splice(removeIndex, 1)

    // then save the profile after taking out the expereince
    await profile.save()

    // send updated profile to response in json format
    res.json(profile)
    // catch error if it happens because we can find the user
  } catch (err) {
    // console log the error message
    console.error(err.message)
    // send response status 500 and send server error to console
    res.status(500).send('Server Error')
  }
})
