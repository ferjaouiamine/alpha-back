const nodemailer =require('nodemailer');

//step 1 mailer
module.exports.sendMail = async (req,res) =>{

    let transporter =nodemailer.createTransport({
        service:'gmail',
    auth:{
      user:process.env.EMAIL ,
      pass:process.env.PASSWORD 
    }
    
    
    });
    // Step 2
    let mailOptions = {
      from:req.body.email, // TODO: email sender
      to: 'jihedy126@gmail.com', // TODO: email receiver
      subject: 'Alpha learning',
      // subject: req.body.subject,
      text: req.body.text
    };
    // Step 3
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
           console.log('Error occurs');
          return res.status(400).json({msg : 'error send mail'})
      }
      console.log('Email sent!!!');
      return res.status(200).json({msg :'mail send successfully'})
    });
    
}

    
    