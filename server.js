'use strict'

const express = require('express')
const server = express();
const mongoose = require('mongoose')
const cors = require('cors');
const { default: axios } = require('axios');
require('dotenv').config();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT

mongoose.connect('mongodb://osama:osama123@cluster0-shard-00-00.rchco.mongodb.net:27017,cluster0-shard-00-01.rchco.mongodb.net:27017,cluster0-shard-00-02.rchco.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-p6gqv9-shard-0&authSource=admin&retryWrites=true&w=majority');

//schema
const dataSchema = new mongoose.Schema({
    title:String,
    imageUrl:String,
    email:String
})


const dataModel = mongoose.model('color', dataSchema)

// function seed(){
//     const user = new dataModel({
//         title:'red',
//         imageUrl:'blank',
//         email:'quraanrazan282@gmail.com'
//     })
//     const user2 = new dataModel({
//         title:'red',
//         imageUrl:'blank',
//         email:'osqadoomy@gmail.com'
//     })
//     user.save();
//     user2.save();
// }
// seed();

server.get('/getData', getDataHandler)
server.post('/addToFav', addToFavHandler)
server.get('/getFavData', getFavDataHandler)
server.delete('/deleteFavData/:id', deleteFavDataHandler)
server.put('/updateFavData/:id', updateFavDataHandler)

function getDataHandler(req,res){
    let url = `https://ltuc-asac-api.herokuapp.com/allColorData`

    axios.get(url).then(result => {
        const dataArr = result.data.map(item=>{
            return new Color(item)
        })
        // console.log(dataArr)
        res.send(dataArr)
    })
}

function addToFavHandler(req,res){
    const {title,imageUrl,email} = req.body
    const favData = new dataModel({
        title:title,
        imageUrl:imageUrl,
        email:'quraanrazan282@gmail.com'
    })
    favData.save();
}

function getFavDataHandler(req,res){
    dataModel.find({},(error,data)=>{
        res.send(data)
    })
}

function deleteFavDataHandler(req,res){
    const id = req.params.id

    dataModel.deleteOne({_id:id},(error,data)=>{
        dataModel.find({},(error,data)=>{
            res.send(data)
        })
    })
}

function updateFavDataHandler(req,res){
    const id = req.params.id

    dataModel.find({},(error,data)=>{
        data.map((item,index)=>{
            if(index == id){
                item.title = req.body.title,
                item.imageUrl = req.body.imageUrl
            }
            item.save();
        })
        res.send(data)
    })
}








class Color{
    constructor(data){
        this.title = data.title,
        this.imageUrl = data.imageUrl
    }
}


server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})