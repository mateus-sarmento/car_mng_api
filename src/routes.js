const express = require('express');
const Model = require('model');

const router = express.Router()

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

module.exports = router;