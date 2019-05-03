const   express = require('express'),
        router = express.Router({mergeParams: true}),
        Company = require('../models/company'),
        Project = require('../models/project'),
        // Employee = require('../models/employee'),
        Timesheet = require('../models/timesheet');

//GET Projects HTTP method to projects
router.get('/', (req, res) => {
    // Find the company you need to find the projects for and populate the projects data
    Company.findById(req.params.id).populate('projects').exec((err, foundCompany) => {
        if(err){
            res.json({success: false, message: 'Unable to find company!', error: err});
        } else {
            // Once populated, the projects property has all the info filled out to return from the server
            res.json({
                success:true,
                message: 'Successfully got all projects',
                projects: foundCompany.projects
            });
        }
     });
});

//GET HTTP method to find a particular project
router.get('/:proj_id', (req, res) => {
    Project.findById(req.params.proj_id).populate(
    {
        path: 'timesheets',
        model: 'Timesheet',
        populate: {
          path: 'hours.employee',
          model: 'Employee'
        }
    }).exec((err, foundProject) => {
        if(err) {
            res.json({success:false, message: `Failed to load project.`, error: err});
        }
        else {
            res.json({success: true, message: 'You successfully retrieved project', project: foundProject});
    	}
    });
});

//POST HTTP method to /Project
router.post('/', (req, res) => {
    // Find the company for which to create a project
    Company.findById(req.params.id, (err, foundCompany) => {
        if(err){
            res.json({success: false, message: 'Unable to find company!', error: err});
        } else {
            // Use the Project constructor to instantiate a new project
            const newProject = new Project(req.body);
            newProject.totalBalance = newProject.balance;
            // Create a new project to save to the db
            Project.create(newProject, (err, project) => {
                if (err) {
                    res.json({success: false, message: "Could not save project", error: err});
                } else {
                    // Push the created project into the company we found
                    foundCompany.projects.push(project._id);
                    // Save the company
                    foundCompany.save();
                    res.json({success: true, message: "Added project successfully.", project: project});
                }
            });
        }
     });
});

router.put('/:proj_id', (req, res) => {
    Project.findByIdAndUpdate(req.params.proj_id, req.body, {new: true}, (err, foundProject) => {
        if(err) {
            res.json({success: false, message: err});
            return handleError(err);
        }
        foundProject.totalBalance = getTotalBalance(foundProject);
        foundProject.save();
        res.json({success: true, message: 'Successfully updated the project', project: foundProject})
    })
})

// Add Timesheet
router.post('/:proj_id/add-time', (req, res) => {
    Project.findById(req.params.proj_id, (err, foundProject) => {
        if (err) {
            res.json({success: false, message: err});
        } else {
            const newTime = new Timesheet(req.body);
            Timesheet.create(newTime, (err, timesheet) => {
                if(err) {
                    res.json({success: false, message: err});
                } else {
                    foundProject.totalBalance -= timesheet.tot_cost;
                    foundProject.timesheets.push(timesheet._id);
                    foundProject.save();
                    res.json({success: true, message: 'Successfully saved timesheet', timesheet: timesheet});
                }
            });
        }
    });
});

// Add Income
router.post('/:proj_id/add-income', (req, res) => {
    Project.findById(req.params.proj_id, (err, foundProject) => {
        if (err) {
            res.json({success: false, message: err});
        } else {
            const newIncome = req.body;
            foundProject.totalBalance += newIncome.amount;
            foundProject.income.push(newIncome);
            foundProject.save();
            res.json({success: true, message: 'Successfully added income'});
        }
    });
});

// Add Expense
router.post('/:proj_id/add-expense', (req, res) => {
    Project.findById(req.params.proj_id, (err, foundProject) => {
        if (err) {
            res.json({success: false, message: err});
        } else {
            const newExpense = req.body;
            foundProject.totalBalance += newExpense.amount;
            foundProject.expenses.push(newExpense);
            foundProject.save();
            res.json({success: true, message: 'Successfully added an expense'});
        }
    });
});

function getTotalBalance(project) {
    let totalBalance = project.balance;
    project.income.forEach(element => {
        totalBalance += element.amount;
    });
    project.expenses.forEach(element => {
        totalBalance += element.amount;
    });
    project.timesheets.forEach(element => {
        totalBalance -= element.tot_cost;
    })
    return totalBalance;
}
module.exports = router;
