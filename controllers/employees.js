const   express = require('express'),
        Employee = require('../models/employee'),
        router = express.Router();

//GET HTTP method to /Employee
router.get('/', (req, res) => {
    Employee.find((err, employees)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.json({success:true, message: 'Successfully got all employees.', employees: employees});
    	}
    });
});

//GET HTTP method to find a particular Employee
router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, foundEmployee) => {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.json({
                success:true,
                message: `Successfully got employee: ${foundEmployee.name}`,
                employee: foundEmployee
            });
    	}
    });
});

//POST HTTP method to /Employee
router.post('/', (req, res, next) => {
    let newEmployee = new Employee(req.body);
    newEmployee.save((err, employee) => {
        if(err) {
            res.json({
                success: false,
                message: 'Failed to create a new Employee.',
                error: err
            });
        }
        else
            res.json({
                success: true,
                message: "Added successfully.",
                employee: employee
            });

    });
});

router.put('/:id', (req, res, next) => {
    let updatedEmployee = req.body;
    Employee.findByIdAndUpdate(req.params.id, updatedEmployee, (err, oldEmployee) => {
        if(err) {
            res.json({
               success: false,
               message: 'Failed to updated a new Employee.',
               error: err
            });
        }
        else
            res.json({
                success:true,
                message: "Added successfully.",
                oldEmployee: oldEmployee
        });

    });
});

//DELETE HTTP method to /Employee. Here, we pass in a param which is the object id.
router.delete('/:id', (req, res, next) => {
  //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
  //Call the model method deleteListById
    Employee.findByIdAndRemove(id, (err, employee) => {
        if(err) {
            res.json({
                success:false,
                message: 'Failed to delete Employee.'
            });
        }
        else if(Employee) {
            res.json({success:true, message: "Deleted successfully"});
        }
        else
            res.json({success:false});
    })
});

module.exports = router;