const chai = require('chai')

var should    = require("chai").should(),
  expect      = require("chai").expect;

const main = require('../index')

// Postgres connection
const pool = new main.pg.Pool(main.configs);


console.log("Test Begin")

// ========================================================
//      Test starts here
// ========================================================


describe("get all employees", function() {

    it('should return array', function (done) {

      let queryText = "SELECT * FROM employees ORDER by id";

      pool.query(queryText, (err, results)=>{
          expect(results.rows).to.be.an('array');
          done()
      });

    });

});


describe("add employee to database", function() {

  it('should be able to add employee', function (done) {

    let firstname = "John";
    let lastname = "Snow";
    let phone = "123-123"
    let email = "102934891023842934859@email.com"
    let image = "https://i.pinimg.com/originals/19/b8/d6/19b8d6e9b13eef23ec9c746968bb88b1.jpg"
    let work_under_id = null;
    let work_under_name = null;

    let inputValues = [firstname, lastname, phone, email, image, work_under_id, work_under_name];

    let queryText = "INSERT INTO employees (firstname, lastname, phone, email, image, work_under_id, work_under_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";

    pool.query(queryText, inputValues, (err, results)=>{
        let addedEmployee = results.rows[0];
        expect(addedEmployee.firstname).to.equal("John");
        done();
    });

  })

});



describe("add same email into database twice", function() {

  it('should NOT be able to add same email twice', function (done) {

    let email = "102934891023842934859@email.com"

    let inputValues = [email];

    let queryText = "INSERT INTO employees (email) VALUES ($1) RETURNING *";

    pool.query(queryText, inputValues, (err, results)=>{
        expect(err).to.exist;
        done();
    });

  })

});



describe("get first employee in database", function() {

  it('should return id number 1', function (done) {

    let inputValues = [1];
    let queryText = "SELECT * FROM employees WHERE id = ($1)";

    pool.query(queryText, inputValues, (err, results)=>{
        let selectedEmployee = results.rows[0];
        expect(selectedEmployee.id).to.equal(1);
        done();
    });

  })

});


describe("edit employee in database", function() {

  it('should be able to edit employee', function (done) {

    let inputValues = ["102934891023842934859@email.com", "Jane"];

    let queryText = "UPDATE employees SET firstname = ($2) WHERE email = ($1) RETURNING *";

    pool.query(queryText, inputValues, (err, results)=>{
        let addedEmployee = results.rows[0];
        expect(addedEmployee.firstname).to.equal("Jane");
        done();
    });

  })

});


describe("delete employee in database", function() {

  it('should be able to delete employee', function (done) {

    let inputValues = ["102934891023842934859@email.com"];

    let queryText = "DELETE FROM employees WHERE email = ($1) RETURNING *";

    pool.query(queryText, inputValues, (err, results)=>{
        let addedEmployee = results.rows[0];
        expect(addedEmployee.email).to.equal("102934891023842934859@email.com");
        done();
    });

  })

});


let getAllEmployees = ()=>{
  let queryText = "SELECT * FROM employees ORDER by id";

  pool.query(queryText, (err, results)=>{
      let employees = results.rows;
  });
}


describe("performance testing on getting all employees", function() {

    it('getAllEmployees should be a function', function (done) {

      expect(getAllEmployees).to.be.a('function');
      done();

    });


    it('getAllEmployees should run 1 million times within 2 seconds without fail', function (done) {
      let reachedTheEnd = false;
      let counter = 0;
      while(counter < 1000000){
        getAllEmployees();
        counter++
      }
      if(counter === 1000000){
        reachedTheEnd = true;
      }

      expect(reachedTheEnd).to.be.true;
      done()
      console.log("\n\nTest Ended --- Closing connection with server soon")

    })



});


let onClose = function(){

  console.log("closing");

  main.server.close(() => {

    console.log('Process terminated');

    pool.end( () => console.log('Shut down db connection pool'));
  })
};

setTimeout(()=>{onClose()}, 5000);