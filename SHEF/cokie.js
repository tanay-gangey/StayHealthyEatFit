let express = require('express'); 
let cookieParser = require('cookie-parser');
const request = require('request'); 
//setup express app 
let app = express() 

app.use(cookieParser()); 


//basic route for homepage 
app.get('/', (req, res)=>{ 
res.send('welcome to express app'); 
}); 

//JSON object to be added to cookie 
let users = { 
name : "Ritik", 
Age : "18"
} 
let users1 = { 
name : "Pranav", 
Age : "20"
} 

//Route for adding cookie 
app.get('/setuser', (req, res1)=>{ 
console.log("hiii");
request('http://localhost:3000/getuser', function(err, res,body) {
    
    console.log(body.data);
});
 
}); 

//Iterate users data from cookie 
app.get('/getuser', (req, res)=>{ 
//shows all the cookies 
console.log("bye");
res.send(req.cookies.user); 
}); 

//Route for destroying cookie 
app.get('/logout', (req, res)=>{ 
//it will clear the userData cookie  
res.clearCookie('user');


res.send('user logout successfully'); 
}); 


//server listens to port 3000 
app.listen(3000, (err)=>{ 
if(err) 
throw err; 
console.log('listening on port 3000'); 
}); 

