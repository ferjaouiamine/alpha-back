
require("./config/config");
require("./models/db");
require("./config/passportConfig");
const mongoose = require('mongoose');

//pour web rtc
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
require("dotenv").config();
const crypto = require('crypto')
const bcrypt = require('bcryptjs')


//zeydo lel web rtc
const fetch = require('node-fetch');
//node mailer importation 
const nodemailer =require('nodemailer');
const Student = require ('./models/Student/Student.model')

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const routerIndex = require("./routes/index.router");
const app = express();
app.use("/uploads", express.static("uploads"));


// middlewares
app.use(bodyParser.json());
const corsOptions = {
  exposedHeaders: 'Authorization',
};

app.use(cors(corsOptions));

app.use(passport.initialize());
app.use("/api", routerIndex);

let transporter =nodemailer.createTransport({
  service:'gmail',
auth:{
user:process.env.EMAIL || 'ferjaoui44@gmail.com',
pass:process.env.PASSWORD || '03/12/1998ff'
}


});



//api w key 
const API_KEY = process.env.daily_API_KEY;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Bearer " + API_KEY,
};

const getRoom = (room) => {
  return fetch(`https://api.daily.co/v1/rooms/${room}`, {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => console.error("error:" + err));
};
//function tae room 
const createRoom = (room) => {
  return fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: room,
      properties: {
        enable_screenshare: true,
        enable_chat: true,
        start_video_off: true,
        start_audio_off: false,
        lang: "en",
      },
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => console.log("error:" + err));
};
//hethy tae visio conference 
app.get("/video-call/:id", async function (req, res) {
  
  const roomId = req.params.id;

  const room = await getRoom(roomId);
  if (room.error) {
    const newRoom = await createRoom(roomId);
    res.status(200).send(newRoom);
  } else {
    res.status(200).send(room);
  }
});


app.post('/api/reset-password', (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err)
		}
		const token = buffer.toString("hex")
		
		Student.findOne({ email: req.body.email })
			.then(student => {
				if (!student) {
					return res.status(422).json({ error: "student dont exists with that email" })
				}
				student.resetToken = token
				student.save().then((result) => {
					var mailOptions = {
						from: 'Alpha <facter.projet@gmail.com>',
						to: req.body.email,
						subject: 'password reset',
						html: `
					<p>You requested for password reset</p>
					<h5>click in this <a href=http://localhost:3000/reset-password/${token}">link</a> to reset password</h5>
					`
					}
					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							console.log(error)
						}
						else {
							console.log("Reset password email sent")
						}
					})
					res.json({ message: "check your email" })
				})

			})
	})
})




app.post('/api/new-password',(req,res)=>{
  const newPassword = req.body.password
  Student.findOne({email:req.body.email})
  .then(student=>{
      if(!student){
          return res.status(422).json({error:"Try again session expired"})
      }
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
         student.password = hashedpassword
         student.resetToken = undefined
         student.save().then((savedstudent)=>{
             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
})













const port = process.env.PORT || 3001;
// Starting server
app.listen(port, function () {
  console.log("server starting at " + port);
});
