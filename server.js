var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.Promise = Promise

var dbUrl = 'mongodb://127.0.0.1:27017/chatApp'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', async (req, res) => {

   
        var message = new Message(req.body)

        var savedMessage=await message.save()
        var cencored=await Message.findOne({message:"badword"});
        if(cencored){                    
            await Message.remove({_id:cencored.id});// err here deleted because in the care of err catch would handle it
        }else{
            io.emit("message",req.body);
        }
        res.sendStatus(200)
    
    /* .catch((err)=>{
        res.status(500);
        console.log(err);
    });  */
/**This is Nested Callback method which is really hard to understand */
       /*  message.save((err)=>{
            if (err) {
                sendStatus(500); 
            }
            Message.findOne({message:"badword"},(err,cencored)=>{
                if(cencored){
                    console.log("Cencored message found!");                       
                    Message.remove({_id:cencored.id},(err)=>{
                        console.log("Badword removed");    
                    });
                }
            });
        }); */
///////////////////////End of nested CallBackes/////////////////////////////////////////

////////////////////////////////using promises ////////////////////////////////////////////
/* message.save()
    .then(()=>{
        return Message.findOne({message:"badword"});
    })
    .then(cencored=>{
        if(cencored){
            console.log("Cencored message found!");                       
            return Message.remove({_id:cencored.id});// err here deleted because in the care of err catch would handle it
        }
        io.emit("message",req.body);
        res.sendStatus(200)
    })
    .catch((err)=>{
        res.status(500);
        console.log(err);
    }); */
 ///////////////////////////////////////////////End of promises///////////////////////////////      
   
});



io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, { useMongoClient: true }, (err) => {
    console.log('mongo db connection', err)
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})