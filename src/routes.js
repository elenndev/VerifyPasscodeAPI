const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const nodemailer = require('nodemailer');
const PendingValidation = require('./models/pendingValidation');

router.get('/', (req, res) => {
    res.send('testing api successfully');
});

router.post('/validate-code/check-code', async (req, res)=>{
    const { username, email, checkCode } = req.body
    if(!username || !email || !checkCode){
        res.status(400).json({error: "Values not found"})
    }

    const existingPendingValidation = await PendingValidation.findOne({ username, email })
    if(!existingPendingValidation){
        return res.status(400).json({error: 'Pending validation not found for this user'})
    }
    if(existingPendingValidation.expiration <= Date.now()){
        await deletingPendingValidation(email, username)
        .catch((error)=>{
            if(error){
                return res.status(400).json({error: "Error when trying to delete pending validation in the database"})
            }
        })
        return res.status(400).json({error: 'expired code'})
    }

    let response
    if(existingPendingValidation.code.toLowerCase() == checkCode.toLowerCase()){
        await deletingPendingValidation(email, username)
        .catch((error)=>{
            if(error){
                return res.status(400).json({error: "Error when trying to delete pending validation in the database"})
            }
        })
        response = {message: "code validated successfully", checkCode: true}
    } else {
        response = {message: "invalid code", checkCode: false}
    }

    return res.status(200).json(response)
})

router.post('/validate-code/generate-code', async (req, res)=>{
    const { email, username, emailContent } = req.body
    if( !email || !username || !emailContent || !emailContent.subject || !emailContent.text){
        return res.status(400).json({erro: "Values not found"})
    }

    const code = generateRandomCode()
    const expiration = new Date(Date.now() + 60 * 60 * 1000);
    let response
    try{
        const existingPendingValidation = await PendingValidation.findOne({ username, email })
        if(existingPendingValidation){
            existingPendingValidation.code = code
            existingPendingValidation.expiration = expiration
            existingPendingValidation.createdAt = new Date()

            const newValidation = await existingPendingValidation.save()
            if(!newValidation){
                throw new Error() }
            response = {message: "validation code updated", codeGeneration: 200} 

        } else {
            const newValidation = await PendingValidation.create({ username, email, code, expiration })
            if(!newValidation){
                throw new Error() }
            response = {message: "validation code created", codeGeneration: 200}
        }

        const body = `<p>${emailContent.text} <strong>${code}</strong></p>`
        await sendEmail( email, 
            { subject: emailContent.subject, body })
        .catch((error)=>{
            if(error){
                return res.status(400).json({error: "Error when trying to send the email"})
            }
        })
        return res.status(200).json(response)

    }catch(err){
        return res.status(500).json({error: "Request error", codeGeneration: 500})
    }
})

async function deletingPendingValidation(email, username){
    try{
        const deletedPendingValidation = await PendingValidation.deleteOne({email, username})
        if(deletedPendingValidation.deletedCount == 1){
            return true
        } else { throw new Error()}
    }catch(error){
        throw new Error(error)
    }
}

async function sendEmail(email, emailContent){
    const user = process.env.EMAIL_USER
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user,
            pass: process.env.EMAIL_PASS
        }
    })

    try{
        const sendedEmail = await transporter.sendMail({
            from: user,
            to: email,
            subject: emailContent.subject,
            html: emailContent.body
        })
        if(sendedEmail.accepted.length > 0 ){
            return true
        } else { throw new Error() }
    }catch(err){
        throw new Error()
    }
}

function generateRandomCode() {
    const allowChar = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I, L, O, 0, 1
    const codeLength = 6
    let code = '';

    while (code.length < codeLength) {
        const byte = crypto.randomBytes(1)[0];
        const index = byte % allowChar.length;
        const char = allowChar.charAt(index);
        code += char;
    }

    return code;
}

module.exports = router;
