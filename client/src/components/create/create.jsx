import React from 'react';
import axios from 'axios';
import './create.css';
import Nav from '../nav/nav';
import { Redirect } from 'react-router'

class Create extends React.Component {

  constructor(){
      super();
      this.state = {
          employees: [],
          addEmployee: {
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            image: "",
            work_under_id: "",
            work_under_name: "",
          },
          redirectID: "",
          redirect: false,
          alert: ""
      };
  };

  componentDidMount(){

    // Get employees data for selection options later
    //---------------------------------------------
    axios.get("/api/employees")
      .then(response =>{
        let employees = response.data.employees;
        console.log({employees});
        this.setState({ employees });
      })
      .catch(err => console.log(err));
  }


  //Setting all user inputs into state
  //---------------------------------------------
  getFirstName(e){
    let addEmployee = this.state.addEmployee;
    addEmployee.firstname = e.target.value;
    this.setState({ addEmployee });
    console.log(this.state.addEmployee);
  }

  getLastName(e){
    let addEmployee = this.state.addEmployee;
    addEmployee.lastname = e.target.value;
    this.setState({ addEmployee });
    console.log(this.state.addEmployee);
  }

  getPhone(e){
    let addEmployee = this.state.addEmployee;
    addEmployee.phone = e.target.value;
    this.setState({ addEmployee });
    console.log(this.state.addEmployee);
  }

  getEmail(e){
    let addEmployee = this.state.addEmployee;
    addEmployee.email = e.target.value;
    this.setState({ addEmployee });
    console.log(this.state.addEmployee);
  }

  getPicture(e){
    let addEmployee = this.state.addEmployee;
    addEmployee.image = e.target.value;
    this.setState({ addEmployee });
    console.log(this.state.addEmployee);
  }

  getBoss(e){
    let addEmployee = this.state.addEmployee;
    addEmployee.work_under_id = e.target.value;
    addEmployee.work_under_name = e.target.selectedOptions[0].text;
    this.setState({ addEmployee });
    console.log(this.state.addEmployee);
  }
//---------------------------------------------


  // Adding employee into database
  //---------------------------------------------
  addEmployee(){

    let addEmployee = this.state.addEmployee;

    // User input validation
    if(addEmployee.firstname && addEmployee.lastname && addEmployee.phone && addEmployee.email){
      if(addEmployee.email.includes("@") && addEmployee.email.indexOf("@") !== (addEmployee.email.length - 1)){
        axios.post('/api/addemployee/', {
            addEmployee
          })
          .then(response => {
            // If adding is unsuccessful, redirect user
            if(response.data.name === "error"){
              console.log(response.data.detail  );
              this.setState({ alert: `Email: ${this.state.addEmployee.email} already exists` });
              window.scrollTo(0,0);
            } else {
            // If adding is successful, redirect user
              let id = response.data.addedEmployee[0].id;
              this.setState({ redirectID: id });
              this.setState({ redirect: true });
            };

          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.setState({ alert: `Please fill in a valid email` });
        window.scrollTo(0,0);
      }
    } else {
      this.setState({ alert: `Please fill in all the mandatory details` });
      window.scrollTo(0,0);
    }

  }
  //---------------------------------------------


  // Code for redirecting after user added to database
  //---------------------------------------------
  renderRedirect(){
    let id = "" + this.state.redirectID;
    if (this.state.redirect && this.state.redirectID) {
      return <Redirect to={"/show/" + id} />
    };
  }
  //---------------------------------------------


  render(){

    // Plot employees on the html
    let employees = this.state.employees.map(x =>{

                      return  <option value={x.id} >{x.firstname} {x.lastname}</option>
                    })


    // Show alert then remove alert after 5 seconds
    let alert = null;
    if(this.state.alert){
      alert = <div className="alert alert-danger text-center" role="alert">
                {this.state.alert}
              </div>
      setTimeout(function() {
        this.setState({ alert: "" });
      }.bind(this),5000);
    }


    return (
      <div>
        <Nav />
        {alert}
        {this.renderRedirect()}
        <div className="container">
          <h1 className="title">Create Employee Here</h1>
          <form className="mb-5">
            <div className="form-group">
              <label htmlFor="exampleFormControlInput1">First Name *</label>
              <input name="firstName" type="text" className="form-control" id="exampleFormControlInput1" placeholder="John" required onChange={(event) => this.getFirstName(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput2">Last Name *</label>
              <input name="lastName" type="text" className="form-control" id="exampleFormControlInput2" placeholder="Smith" required onChange={(event) => this.getLastName(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput3">Phone Number *<small id="emailHelp" className="form-text text-muted">(Up to 15 characters)</small></label>
              <input name="phone" type="text" className="form-control" id="exampleFormControlInput3" placeholder="111-222-333" required onChange={(event) => this.getPhone(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput4">Email Address *</label>
              <input name="email" type="email" className="form-control" id="exampleFormControlInput4" placeholder="someone@email.com" required onChange={(event) => this.getEmail(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput5">Profile Picture</label>
              <input name="image" type="text" className="form-control" id="exampleFormControlInput5" placeholder="Place link here" onChange={(event) => this.getPicture(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1">Works Under</label>
              <select name="worksUnder" className="form-control" id="exampleFormControlSelect1" onChange={(event) => this.getBoss(event)} >
                <option selected disabled>Choose Employee</option>
                {employees}
              </select>
            </div>
            <button type="button" className="button3" onClick={() => this.addEmployee()} >Create Employee</button>
          </form>
        </div>
      </div>
    );
  };
};

export default Create;