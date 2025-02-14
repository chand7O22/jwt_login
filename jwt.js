const express=require("express")
const app=express()
const jwt=require("jsonwebtoken")

JWT_SECRET="ibibiaioa29h@#Njfofpfj_IRI"
let users=[]

app.use(express.json())

function logger(req, res, next){
  console.log(req.method+" request came \n")
  next()
}

function auth(req, res, next){
  let tok=req.headers.token
  let userName=jwt.verify(tok, JWT_SECRET)

  let uName=users.find(u => u.username==userName.username)

  if(uName){
    req.username=uName.username
    next()
  }

  else{
    res.json({
      message:"unAuthorised"
    })
  }
}

app.get("/hi", (req, res)=>{
  res.sendFile(__dirname+"/index.html")
})

app.post("/signup",logger, (req, res)=>{
  const uname=req.body.username;
  const passw=req.body.password

  if(uname!="" && passw!=""){
    for(i=0;i<users.length;i++){
      if(users[i].username==uname){
        res.json({
          msg:"user already exists!"
        })
        return;
      }
    }

    users.push({
      username:uname,
      password:passw
    })

    res.json({
      msg:"signup successful"
    })
  }
})

app.post("/signin",logger, (req, res)=>{
  const uName=req.body.username
  const passW=req.body.password

  let foundUser=users.find((u)=>{
    if(u.username==uName && u.password==passW){
      return u
    }
  })

  if(foundUser){
    let token=jwt.sign({
      username:foundUser.username
    },JWT_SECRET)
    res.json({
      token:token
    })
  }
  else{
    res.json({
      msg:"incorrect username or password!"
    })
  }
})

app.get("/me", logger, auth, (req, res)=>{

  const uName=users.find((u)=> u.username===req.username)

  if(uName){
   res.json({
    username:uName.username,
    password:uName.password
   }) 
  }

  else{
    res.json({
      message:"unAuthorised"
    })
  }
})

app.post("/users", (req,res)=>{
  res.json({
    users
  })
})

app.listen(3000)