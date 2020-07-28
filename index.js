const ipfsClient= require('ipfs-http-client')
const express=require('express')
const FileUpload=require('express-fileupload')
const bodyParser=require('body-parser')
const { fileLoader } = require('ejs')
const fileUpload = require('express-fileupload')
const fs=require ('fs')
const ipfs= new ipfsClient({host:'localhost',port:'5001',protocol:'http'})

const app=express()

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())


app.get('/',(req,res)=>{
    res.render('home')
})

app.post('/upload',(req,res)=>{
    const file=req.files.file
    const fileName=req.body.fileName
    const filePath='files/'+fileName

    file.mv(filePath, async (err)=>{
        if (err){
            console.log("Error: Failed to download the file")
            return res.status(500).send(err)
        }
    
        const fileHash= await addFile(fileName,filePath)
        fs.unlink(filePath,(err)=>{
            if (err){
                console.log(err)
            }
        })
        res.render('upload',{fileName,fileHash})
    }) 
    
})

const addFile=async(fileName,filePath) => {
    const file=fs.readFileSync(filePath)
    const fileAdded=await ipfs.add({path:fileName, content: file})
    console.log(fileAdded)
    const fileHash=fileAdded.cid
    //console.log(fileHash)
    return fileHash

}

app.listen(3000, ()=>{
    console.log("Server is listening from port 3000")
})