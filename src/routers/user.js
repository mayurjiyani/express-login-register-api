const express = require("express")
const User = require('../model/users')
const router = new express.Router()
const auth = require('../middleware/auth');

router.post("/users", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        // sendWelcomeEmail(user.email, user.name)
        const token = await user.generatAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)

        const token = await user.generatAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e.toString())
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// router.get('/users', async (req, res) => {

//     try {
//         User.find({}, function (err, users) {
//             res.send(users);
//         });
//     } catch (e) {
//         res.status(400).send(e)
//     }

// })

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send("logout successfully")
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router