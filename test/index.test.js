const chai = require('chai')

var should    = require("chai").should(),
  expect      = require("chai").expect;

const main = require('../index')



describe("get all employees", function() {

    it('should return array', function () {
      main.app.get('/api/employees', async (req, res)=>{

          let queryText = "SELECT * FROM employees ORDER by id";

          await main.pool.query(queryText, (err, results)=>{
              let employees = results.rows
              expect(employees).to.be.an('array');
          });
      });

    })

});


describe("get first employee in database", function() {

    it('should return id number 1', function () {
        main.app.get('/api/employee/1', async (req, res)=>{

            let inputValues = [1];
            let queryText = "SELECT * FROM employees WHERE id = ($1)";

            await main.pool.query(queryText, inputValues, (err, results)=>{
                let selectedEmployee = results.rows[0];
                expect(selectedEmployee.id).to.equal(1);
            });

        });

    })

});


describe("add employee to database", function() {

    it('should be able to add employee', function () {
      main.app.post('/api/addemployee/', async (req, res)=>{

          let firstname = "John";
          let lastname = "Snow";
          let phone = "123-123"
          let email = "jsnow@email.com"
          let image = "https://i.pinimg.com/originals/19/b8/d6/19b8d6e9b13eef23ec9c746968bb88b1.jpg"
          let work_under_id = null;
          let work_under_name = null;

          let inputValues = [firstname, lastname, phone, email, image, work_under_id, work_under_name];

          let queryText = "INSERT INTO employees (firstname, lastname, phone, email, image, work_under_id, work_under_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";

          await main.pool.query(queryText, inputValues, async (err, results)=>{
              let addedEmployee = results.rows[0];
              await expect(addedEmployee.firstname).to.equal("John");
          });

      });

    })

});



describe("edit first employee in database", function() {

    it('should be able to edit employee', function () {
      main.app.post('/api/editemployee/', async (req, res)=>{

          let inputValues = [1, "Jane"];

          let queryText = "UPDATE employees SET firstname = ($2) WHERE id = ($1) RETURNING *";

          await main.pool.query(queryText, inputValues, async (err, results)=>{
              let addedEmployee = results.rows[0];
              await expect(addedEmployee.firstname).to.equal("Jane");
          });

      });

    })

});



describe("delete first employee in database", function() {

    it('should be able to delete employee', function () {
      main.app.post('/api/delete/', async (req, res)=>{

          let inputValues = [1];

          let queryText = "DELETE FROM employees WHERE id = ($1) RETURNING *";

          await main.pool.query(queryText, inputValues, async (err, results)=>{
              let addedEmployee = results.rows[0];
              await expect(addedEmployee.id).to.equal(1);
          });

      });

    })

});



let getAllEmployees = ()=>{
        main.app.get('/api/employees', async (req, res)=>{

          let queryText = "SELECT * FROM employees ORDER by id";

          await main.pool.query(queryText, (err, results)=>{
              let employees = results.rows
              expect(employees).to.be.an('array');
          });
      });
}


describe("get all employees 1,000,000 times", function() {

    it('should return array all 1 million times without fail', function () {
      let reachedTheEnd = false;
      for(let i=0; i < 1000000; i++){
        getAllEmployees();
        if(i = 999999){
          reachedTheEnd = true;
        }
      }
      expect(reachedTheEnd).to.be.true;

    })

});



let onClose = function(){

  console.log("closing");

  main.server.close(() => {

    console.log('Process terminated');

    main.pool.end( () => console.log('Shut down db connection pool'));
  })
};

onClose();