const express = require('express')
const session = require('express-session')
const passport = require('passport')
const path = require('path');

require("./auth")

const app = express()
app.use(session({ secret: 'cats' }))
app.use(passport.initialize())
app.use(passport.session())

const port = 5000

function isLoggedIn(req, res, next){
    req.user ? next() : res.sendFile(path.join(__dirname, '/public/unauthorized.html'))
}
// '<a href="/auth/google"> Authenticate with Google</a>'
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index2.html')))

app.get(
    '/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile']})
)

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    })
)

app.get('/auth/failure', (req, res) => res.sendFile(path.join(__dirname, '/public/unauthorized.html')))
//res.send(`Hello ${req.user.displayName}`)
app.get('/protected', isLoggedIn, (req, res) => res.sendFile(path.join(__dirname, '/public/successLogin.html')))

app.get('/logout', (req, res) => {
    
    req.session.destroy()
    res.sendFile(path.join(__dirname, '/public/goodbye.html'))
})


app.listen(port, () => console.log(`Listening on port ${port}!`))