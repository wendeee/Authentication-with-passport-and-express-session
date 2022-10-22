const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser')
const User = require('./model/user')
const app = express();

//********************MIDDLEWARE*******************//
app.use(bodyParser.urlencoded({extended: false})) //parse incoming data from form

app.use(session({                    //configure express session
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge: 60 * 60 * 1000}
}))                                              

app.use(passport.initialize()) //this will configure app to use passport
app.use(passport.session())   //this will configure app to use persistent login session

// ****************************************************************//

// *************CONFIGURE PASSPORT**************//
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())   //this will serialize authenticated user to the session
passport.deserializeUser(User.deserializeUser()) //this will deserialize user when subsequent requests are made

// ****************************************************************************************//


// *********SET TEMPLATE ENGINE *******************//
app.set('views', 'views')
app.set('view engine', 'ejs')
//*************************************************//

//*****************ROUTES*********************//
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    let newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.email,
    })
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err.message)
            
           return res.redirect('/register')
        }
        res.redirect('/login')
      
    })
   
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login',passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {
    //if authentication is successful, redirect to the expected page
    
    res.redirect('/dashboard')
} )

app.get('/dashboard', (req, res) => {
   
    res.render('dashboard', {user: req.user})
})

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        res.redirect('/')
    });
   
})
//*****************************************************************//


// *********************CONNECT DATABASE**************************//
mongoose.connect('mongodb://localhost:27017/users-passportjs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
}).then(() => {
    console.log('Connected to DB successfully')
})
// **************************************************//

// *****************START SERVER*****************************//
app.listen('3007', ()=> {
    console.log('server is running on http://localhost:3007')
})