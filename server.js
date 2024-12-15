const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const configViewEngine = require('./src/configs/viewEngine');

// const passport = require('./src/utils/auth');

// auth router
// const authRouter = require('./src/routes/auth/authRouter');

//api router
const adminApiRouter = require('./src/routes/api/adminRouter');
const userApiRouter = require('./src/routes/api/userRouter');
const apiRouter = require('./src/routes/api/apiRouter');

const app = express();

const port = process.env.PORT || 8888;

// // Middleware Passport
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// app.use('/auth/', authRouter)

app.use('/api/admin/', adminApiRouter);
app.use('/api/user/', userApiRouter);
app.use('/api/', apiRouter);

configViewEngine(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});