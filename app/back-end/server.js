var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var cookieParser = require('cookie-parser');

mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb://localhost/webdev2', 
    { useMongoClient: true }
);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Connected!!!")
});

var categorySchema = mongoose.Schema({
    name:String
});

var Category = mongoose.model('categories', categorySchema);

var itemSchema = mongoose.Schema({
    name:String,
    price:Number,
    size:Number,
    category:{
        _id:String,
        name:String
    }
});

var Item = mongoose.model('items', itemSchema);

var userSchema = mongoose.Schema({
    login:String,
    password:String
});

var User = mongoose.model('users', userSchema);

app.use(express.static('app/front-end'));
app.use(express.static('node_modules/angular'));
app.use(express.static('node_modules/angular-route'));
app.use(express.static('node_modules/bootstrap'));
app.use(bodyParser.json());
app.use(session({
    key: 'user_sid',
    secret: 'jgchgfgxxfdx',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
app.use((req, res, next) => {
    if (req.cookies && req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

var preAuth = function(req, resp, next){
    if(req.session && req.session.user){
        return next();
    }else{
        return resp.sendStatus(401);
    }
}

app.post('/registration', function(req, resp){
    bcrypt.genSalt(10, function(err, salt){
        if(err) err=>resp.sendStatus(500);
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if(err) err=>resp.sendStatus(500);
            req.body.password = hash;
            new User(req.body).save().then(
                res=>resp.sendStatus(204),
                err=>resp.sendStatus(500)
            );
        });
    });
});

app.post('/login', function(req, resp){
    User.findOne({login:req.body.login}).exec().then(
        user=>{
            bcrypt.compare(req.body.password, user.password).then(
                res=>{
                    if(res){
                        req.session.user = user;
                        resp.sendStatus(204);
                    }else{
                        resp.sendStatus(401);
                    }
                },
                err=>resp.sendStatus(401)
            );
        },
        err=>resp.sendStatus(401)
    );
});

app.get('/categories', function(req, resp){
    Category.find().exec().then(
        res=>resp.json(res),
        err=>resp.sendStatus(500)
    );
});
app.post('/categories', preAuth, function(req, resp){
//    req.session.user._id;
    new Category(req.body).save().then(
        res=>resp.json(res),
        err=>resp.sendStatus(500)
    );
});

app.put('/categories/:id', function(req, resp){
    Category.updateOne(
        {_id:req.params.id},
        {$set:{ name:req.body.name }})
    .then(
        res=>{
            Item.updateMany(
                {'category._id':req.params.id},
                {$set:{'category.name':req.body.name}})
            .then(
                res=>resp.sendStatus(204),
                err=>resp.sendStatus(500)
            );
        },
        err=>resp.sendStatus(500)
    );
});
app.delete('/categories/:id', function(req, resp){
    Category.remove({_id:req.params.id}).then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});

app.get('/items', function(req, resp){
    Item.find().exec().then(
        res=>resp.json(res),
        err=>resp.sendStatus(500)
    );
});
app.post('/items', function(req, resp){
//    req.body.category.id = req.body.category._id;
    new Item(req.body).save().then(
        res=>resp.json(res),
        err=>resp.sendStatus(500)
    );
});
app.put('/items/:id', function(req, resp){
    Item.updateOne(
        {_id:req.params.id},
        {$set:{
            name:req.body.name,
            category:req.body.category
        }})
    .then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});
app.delete('/items/:id', function(req, resp){
    Item.remove({_id:req.params.id}).then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});

app.listen(3000, function(){
    console.log('Server listen port 3000');
});