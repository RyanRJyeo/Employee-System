import React from 'react';
import axios from 'axios';
import './employees.css';
import Nav from '../nav/nav';


class Employees extends React.Component {
  constructor(){
      super();
      this.state = {
          employees: [],
          alert: ""
      };
  };

  componentDidMount(){
    // fetch('/api/employees')
    //   .then(res => res.json())
    //   .then(employees => this.setState({ employees }));


    //Get selected all employees data and set to state
    //---------------------------------------------
    axios.get("/api/employees")
      .then(response =>{
        let employees = response.data.employees;
        console.log({employees});
        this.setState({ employees });
      })
      .catch(err => console.log(err));
  };

  deleteEmployee(value){
    let id = "" + value
    axios.post('/api/delete/', {
        id
      })
      .then(response => {
        // If editing is unsuccessful, alert user
        if(response.data.name === "error"){
          console.log(response.data.detail  );
          this.setState({ alert: `Employee deletion unsuccessful` });
          window.scrollTo(0,0);
        } else {
        // If editing is successful, alert user and refresh page after 2 seconds
          let deletedEmployee = response.data.deletedEmployee;
          this.setState({ alert: `Employee ${deletedEmployee.firstname} ${deletedEmployee.lastname} has been deleted` });
          setTimeout(function() {window.location.reload();}.bind(this),1500);
        };

      })
      .catch(err => {
        console.log(err);
      });
  }

  render(){


    // Render all employees onto the table
    //---------------------------------------------
    let employees = this.state.employees.map(x =>{
                      let id = this.state.employees.indexOf(x) + 1;
                      return  <tr className="table-data" key={id}>
                                <td>{id}</td>
                                <td>{x.firstname} {x.lastname}</td>
                                <td> <a href={`/show/${x.id}`}>Show</a> <span className="divider">|</span> <a href={`/edit/${x.id}`}>Edit</a> <span className="divider">|</span>  <a data-toggle="collapse" href={"#collapseExample" + x.id} role="button" aria-expanded="false" aria-controls="collapseExample" onClick={()=> window.scrollTo(0,0)}> Delete </a> </td>
                              </tr>
                    });
    //---------------------------------------------


    // If no employees at all, render message instead
    //---------------------------------------------
    let table = <p className="text-center mt-5 mb-5">You do not have any employees yet, let's create some!</p>
    if(this.state.employees.length > 0){
        table = <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees}
                  </tbody>
                </table>
    }

    //---------------------------------------------


    // Render all bootstrap collapse item
    //---------------------------------------------
    let collapseContent = this.state.employees.map(x =>{
      return  <div className="collapse" key={x.id} id={"collapseExample" + x.id}>
                <div className="card card-body">
                  <div className="text-right">
                    <a className="btn btn-sm btn-secondary" data-toggle="collapse" href={"#collapseExample" + x.id} role="button" aria-expanded="false" aria-controls="collapseExample"> X </a>
                  </div>

                  Are you sure you want to delete {x.firstname} {x.lastname} ?
                  <br/>
                  This employee will permanently be deleted from the database
                  <br/>

                  <div className="mt-5">
                    <button className="btn btn-outline-danger" onClick={()=> this.deleteEmployee(x.id)}>Yes delete permanently</button>
                  </div>
                </div>
              </div>
    });
    //---------------------------------------------


    // Show alert then remove alert after 5 seconds
    //---------------------------------------------
    let alert = null;
    if(this.state.alert){
      alert = <div className="alert alert-danger text-center" role="alert">
                {this.state.alert}
              </div>
      setTimeout(function() {
        this.setState({ alert: "" });
      }.bind(this),5000);
    }
    //---------------------------------------------



    return (
      <div>

          <Nav/>
          {alert}
          {collapseContent}

          <h1 className="title">All Employees</h1>

          {table}

          <div className="buttonDiv"><button className="button2"> <a href="/create">Create Employee</a> </button></div>

      </div>
    );
  };
};

export default Employees;