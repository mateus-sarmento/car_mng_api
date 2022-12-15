const express = require('express');
const Model = require('./model');

require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

const User = require('./user')

//Post Method
router.post('/vehicle', async (req, res) => {
    const data = new Model({
        marca: req.body.marca,
        modelo: req.body.modelo,
        odo: req.body.odo,
        ano: req.body.ano
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({messvalue: error.messvalue})
    }
})

//Get all Method
router.get('/vehicle', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({messvalue: error.messvalue})
    }
})

//Get by ID Method
router.get('/getOneVehicle/:id', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({messvalue: error.messvalue})
    }
})

//Update by ID Method
router.patch('/updOneVehicle/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ messvalue: error.messvalue })
    }
})

//Delete by ID Method
router.delete('/delOneVehicle/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Deleted successfully..`)
    }
    catch (error) {
        res.status(400).json({ messvalue: error.messvalue })
    }
})

//Privado
router.get('/user/:id', checkToken, async (req,res) => {
    const id = req.params.id

    const user = await User.findById(id, '-password')
    if(!user) {
        return res.status(404).json({msg:'Usuario não encontrado'})
    }

    return res.status(200).json({user})
})

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if(!token) {
        return res.status(401).json({msg:"Acesso negado"})
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    } catch (error) {
        res.status(400).json({msg:"Token invalido"})
    }
}
//Registrar Usuario
router.post('/auth/register', async(req, res) => {
    const {name, password} = req.body
    if(!name) {
        return res.status(422).json({msg: 'Usuario invalido!'})
    }
    if(!password) {
        return res.status(422).json({msg: 'Senha é necessaria!'})
    }

    const userExists = await User.findOne({name:name})
    if(userExists) {
        return res.status(422).json({msg: 'Usuario ja existe!'})
    }

    const salt = await bcrypt.genSalt(12)
    const passHash = await bcrypt.hash(password, salt)

    const newUser = new User({
        name,
        password: passHash
    })

    try {
        await newUser.save()
        res.status(200).json({msg:"Usuario criado!"})
    } catch(error) {
        res.status(500).json({msg:error})
    }

})

// Login

router.post('/auth/user', async (req,res) => {
    const {name, password} = req.body

    if(!name) {
        return res.status(422).json({msg: 'Usuario Invalido!'})
    }
    if(!password) {
        return res.status(422).json({msg: 'Senha é necessaria!'})
    }

    //verificar se usuario existe
    const userExists = await User.findOne({name:name})
    if(!userExists) {
        return res.status(404).json({msg: 'Usuario não encontrado!'})
    }

    //verificar senha
    const checkPass = await bcrypt.compare(password, userExists.password)
    if(!checkPass) {
        return res.status(422).json({msg: 'Senha Invalida'})
    }
    
    try {
        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: userExists._id,
            },
            secret,
        )        
        res.status(200).json({msg: 'Usuario autenticado', token})
    } catch(err) {
        res.status(500).json({msg:err})
    }
})

module.exports = router;