//==========================================
//              Config
//==========================================
const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');

// Initialise postgres client
const configs = {
user: 'ryan',
host: '127.0.0.1',
database: 'employee-system-dev',
port: 5432,
};


// Express Config
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));

// Postgres connection
const pool = new pg.Pool(configs);
//==========================================




//==========================================
// Model and controller here
//==========================================


// Get all employees
app.get('/api/employees', async (req, res)=>{

    let queryText = "SELECT * FROM employees ORDER by id";

    await pool.query(queryText, async (err, results)=>{
        let employees = results.rows
        await res.send({employees});
    });
});


// Get one employee
app.get('/api/employee/:id', async (req, res)=>{

    let id = parseInt(req.params.id);
    let inputValues = [id];
    let queryText = "SELECT * FROM employees WHERE id = ($1)";

    await pool.query(queryText, inputValues, async (err, results)=>{
        let selectedEmployee = results.rows;
        await res.send({selectedEmployee});
    });

});


// Create employee
app.post('/api/addemployee/', async (req, res)=>{

    let addEmployee = req.body.addEmployee;
    let firstname = addEmployee.firstname;
    let lastname = addEmployee.lastname;
    let phone = addEmployee.phone;
    let email = addEmployee.email;
    let image = addEmployee.image || "https://i.pinimg.com/originals/19/b8/d6/19b8d6e9b13eef23ec9c746968bb88b1.jpg"
    let work_under_id = addEmployee.work_under_id || null;
    let work_under_name = addEmployee.work_under_name || null;

    let inputValues = [firstname, lastname, phone, email, image, work_under_id, work_under_name];

    let queryText = "INSERT INTO employees (firstname, lastname, phone, email, image, work_under_id, work_under_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";

    await pool.query(queryText, inputValues, async (err, results)=>{
        if(results){
          let addedEmployee = await results.rows;
          res.send({addedEmployee});
        } else {
          res.send(err);
        }

    });

});


// Update edits of employee
app.post('/api/editemployee/', async (req, res)=>{

    let editEmployee = req.body.editEmployee;
    let id = editEmployee.id;
    let firstname = editEmployee.firstname;
    let lastname = editEmployee.lastname;
    let phone = editEmployee.phone;
    let email = editEmployee.email;
    let work_under_id = editEmployee.work_under_id;
    let work_under_name = editEmployee.work_under_name;
    if(work_under_id === null || work_under_id === "nobody"){
      work_under_id = null;
      work_under_name = null;
    }


    let inputValues = [id, firstname, lastname, phone, email, work_under_id, work_under_name];

    let queryText = "UPDATE employees SET firstname = ($2), lastname = ($3), phone = ($4), email = ($5), work_under_id = ($6), work_under_name = ($7) WHERE id = ($1) RETURNING *";


    await pool.query(queryText, inputValues, async (err, results)=>{
        if(results){
          let editedEmployee = await results.rows;
          res.send({editedEmployee});
        } else {
          res.send(err);
        }

    });

});


// Update image of employee
app.post('/api/editimage/', async (req, res)=>{

    let id = req.body.editImage.id;
    let image = req.body.editImage.image;

    let inputValues = [id, image];

    let queryText = "UPDATE employees SET image=($2) WHERE id = ($1) RETURNING *";


    await pool.query(queryText, inputValues, async (err, results)=>{
        if(results){
          let editedEmployee = await results.rows;
          res.send({editedEmployee});
        } else {
          res.send(err);
        }

    });

});


// Delete employee
app.post('/api/delete/', async (req, res)=>{

    let id = req.body.id;

    let inputValues = [id];

    let queryText = "DELETE FROM employees WHERE id = ($1) RETURNING *";

    await pool.query(queryText, inputValues, async (err, results)=>{
        if(results){
          let deletedEmployee = await results.rows[0];

          let queryText2 = "SELECT * FROM employees ORDER by id";


          await pool.query(queryText2, async(err,results)=>{
            try{
              console.log("query 2 started")
              let employeesArray = await results.rows;
              for(let i=0; i < employeesArray.length; i++){
                if(parseInt(employeesArray[i].work_under_id) === parseInt(deletedEmployee.id)){

                  let inputValues3 = [parseInt(employeesArray[i].id)];
                  let queryText3 = "UPDATE employees SET work_under_id = NULL, work_under_name = NULL WHERE id = ($1) RETURNING *";

                  await pool.query(queryText3, inputValues3, async (err, results)=>{
                    try{
                      console.log("Done at query 3 ");
                      console.log(results.rows);
                    } catch (err){
                      console.log("Error at query 3 " + err);
                    };
                  })

                }
              }
            } catch(err){
              console.log("Error at query 2 " + err);
            }
          })


          res.send({deletedEmployee});
        } else {
          res.send(err);
        }

    });

});
//==========================================



//==========================================
// Initialize port
//==========================================

port = 5000;

const server = app.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
});

let onClose = function(){

  console.log("closing");

  server.close(() => {

    console.log('Process terminated');

    pool.end( () => console.log('Shut down db connection pool'));
  })
};

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);
//==========================================





// Export Test Configs
//==========================================
module.exports = {pool, app, server}
//==========================================