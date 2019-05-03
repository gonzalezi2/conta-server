const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Company = require('../models/company');
const Project = require('../models/project');

//GET HTTP method to /company
router.get('/', (req, res) => {
    Company.find().populate('projects').exec((err, companies)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.json({success:true, message: `Successfully got all companies`, companies: companies});
    	}
    });
});

//GET HTTP method to find a particular company
router.get('/:id', (req, res) => {
    Company.findById(req.params.id).populate('projects').exec((err, foundCompany) => {
        if(err) {
            res.json({success: false, message: `Failed to find company. Error: ${err}`});
        }
        else {
            res.json({success: true, message: `You've found the company!`, company: foundCompany});
    	}
    });
});

//POST HTTP method to /company
router.post('/', (req, res) => {
    let newCompany = new Company(req.body);
    newCompany.save((err) => {
        if(err) {
            res.json({success: false, message: `Failed to create a new company. Error: ${err}`});

        }
        else
            res.json({success:true, message: "Added successfully."});

    });
});

//PUT HTTP method to /company
router.put('/:id', (req, res) => {
    let updatedCompany = req.body;
    Company.findByIdAndUpdate(req.params.id, updatedCompany, (err) => {
        if(err) {
            res.json({success: false, message: `Failed to updated a new company. Error: ${err}`});
        }
        else
            res.json({success:true, message: "Updated successfully."});

    });
});

//DELETE HTTP method to /company. Here, we pass in a param which is the object id.
router.delete('/:id', (req, res, next) => {
    Company.findByIdAndRemove(req.params.id, (err, company) => {
        if(err) {
            res.json({success:false, message: `Failed to delete company. Error: ${err}`});
        }
        else if(company) {
            res.json({success:true, message: "Deleted successfully"});
        }
        else
            res.json({success:false});
    })
});

module.exports = router;