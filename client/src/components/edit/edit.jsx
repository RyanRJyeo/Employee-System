import React from 'react';
import axios from 'axios';
import './edit.css';
import Nav from '../nav/nav';
import { Redirect } from 'react-router'

class Edit extends React.Component {

  constructor(){
      super();
      this.state = {
          employees: [],
          foundSubordinate: false,
          editEmployee: {
            id: "",
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            work_under_id: "",
            work_under_name: ""
          },
          editImage: {
            id: "",
            image: ""
          },
          redirectID: "",
          redirect: false,
          alert: ""
      };
  };


  // Get employee data
  //---------------------------------------------
  componentDidMount(){

    // Get employee data to be edited
    let requestID = this.props.match.params.id;

    axios.get("/api/employee/"+requestID)
      .then(response =>{
        let editEmployee = response.data.selectedEmployee[0];
        this.setState({ editEmployee });
        let editImage = this.state.editImage;
        editImage.id = response.data.selectedEmployee[0].id;
        this.setState({ editImage });
      })
      .catch(err => console.log(err));


    // Get employees data for selection options later
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
    let editEmployee = this.state.editEmployee;
    editEmployee.firstname = e.target.value;
    this.setState({ editEmployee });
    console.log(this.state.editEmployee);
  }

  getLastName(e){
    let editEmployee = this.state.editEmployee;
    editEmployee.lastname = e.target.value;
    this.setState({ editEmployee });
    console.log(this.state.editEmployee);
  }

  getPhone(e){
    let editEmployee = this.state.editEmployee;
    editEmployee.phone = e.target.value;
    this.setState({ editEmployee });
    console.log(this.state.editEmployee);
  }

  getEmail(e){
    let editEmployee = this.state.editEmployee;
    editEmployee.email = e.target.value;
    this.setState({ editEmployee });
    console.log(this.state.editEmployee);
  }

  getBoss(e){
    let editEmployee = this.state.editEmployee;
    editEmployee.work_under_id = e.target.value;
    editEmployee.work_under_name = e.target.selectedOptions[0].text;
    this.setState({ editEmployee });
    console.log(this.state.editEmployee);
  }

  getImage(e){
    let editImage = this.state.editImage;
    editImage.image = e.target.value;
    this.setState({ editImage });
  }

//---------------------------------------------


  // Update edits into database
  //---------------------------------------------
  editEmployee(){

    let editEmployee = this.state.editEmployee;

    // User input validation
    if(editEmployee.firstname && editEmployee.lastname && editEmployee.phone && editEmployee.email){
      if(editEmployee.email.includes("@") && editEmployee.email.indexOf("@") !== (editEmployee.email.length - 1)){
        axios.post('/api/editemployee/', {
            editEmployee
          })
          .then(response => {
            // If editing is unsuccessful, alert user
            if(response.data.name === "error"){
              console.log(response.data.detail  );
              this.setState({ alert: `Email: ${this.state.editEmployee.email} already exists` });
              window.scrollTo(0,0);
            } else {
            // If editing is successful, redirect user to show page
              let id = response.data.editedEmployee[0].id;
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

  editImage(){
    let editImage = this.state.editImage;

    axios.post('/api/editimage/', {
        editImage
      })
      .then(response => {
        // If editing is unsuccessful, alert user
        if(response.data.name === "error"){
          console.log(response.data.detail  );
          this.setState({ alert: `Image upload unsuccessful` });
          window.scrollTo(0,0);
        } else {
        // If editing is successful, redirect user back to edit page
          this.setState({ redirect: true });
        };

      })
      .catch(err => {
        console.log(err);
      });
  }
  //---------------------------------------------


  // Redirecting after user added to database
  //---------------------------------------------
  renderRedirect(){
    let id = "" + this.state.redirectID;
    if (this.state.redirect && this.state.redirectID) {
      return <Redirect to={"/show/" + id} />
    } else if (this.state.redirect && !this.state.redirectID){
      window.location.reload();
    }
  }
  //---------------------------------------------


  // Redirect back to show page
  //---------------------------------------------
  backToShow(){
    let id = this.state.editEmployee.id;
    this.setState({ redirectID: id });
    this.setState({ redirect: true });
  }
  //---------------------------------------------


  // Curating the employees array (make sure employee cannot work under self, or any subordinates under him in any hierarchy)
  //---------------------------------------------
  findSame(){
    let array = this.state.employees;
    for(let i=0; i < array.length; i++){
      if(array[i].id === this.state.editEmployee.id){
        console.log("found same")
        array.splice(i, 1);
        this.setState({ employees: array })
      } else {
        if(array[i].work_under_id){
          if(array[i].work_under_id === this.state.editEmployee.id){
            console.log("im the boss of " + array[i].firstname)
            array.splice(i, 1);
            this.setState({ employees: array })
          } else {
            this.findWorkForWho(array[i].id)
            if(this.state.foundSubordinate){
              array.splice(i, 1);
              this.setState({ employees: array })
              this.setState({ foundSubordinate: false});
            };
          };
        };
      };
    };
  };

  findWorkForWho(id){
    let requestID = "" + id;

    axios.get("/api/employee/"+requestID)
      .then(response =>{
        let employee = response.data.selectedEmployee[0];
        if(!employee.work_under_id){
          if(employee.id === this.state.editEmployee.id){
            return;
          }
        } else {
          if(employee.work_under_id === this.state.editEmployee.id){
            this.setState({ foundSubordinate: true });
          } else {
            this.findWorkForWho(employee.work_under_id);
          };
        };
      })
      .catch(err => console.log(err));
  }
  //---------------------------------------------




  render(){

    // Plot employees on the html
    let employees = this.state.employees.map(x =>{

                      return  <option key={x.id} value={x.id} >{x.firstname} {x.lastname}</option>
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


    // Curate the employees array
    this.findSame();

    return (
      <div>
        <Nav />
        {alert}
        {this.renderRedirect()}
        <div className="container">
          <h1 className="title">Edit Employee: {this.state.editEmployee.firstname}</h1>
          <div className="profile-pic2">
            <img src={this.state.editEmployee.image}  alt="user-profile" />
          </div>
          <div className="buttonDiv">
            <button className="button3 mt-3" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
              Change Profile Picture
            </button>
          </div>

          <div className="collapse" id="collapseExample">
            <div className="card card-body">
              <div className="form-group">
                <input name="image" type="text" className="form-control" placeholder="Place image link here" onChange={(event) => this.getImage(event)} />
              </div>
              <button className="btn-sm btn-secondary" onClick={() => this.editImage()} >Save</button>
            </div>
          </div>

          <form className="mb-5 mt-5">
            <div className="form-group">
              <label htmlFor="exampleFormControlInput1">First Name *</label>
              <input name="firstName" type="text" className="form-control" id="exampleFormControlInput1" value={this.state.editEmployee.firstname} required onChange={(event) => this.getFirstName(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput2">Last Name *</label>
              <input name="lastName" type="text" className="form-control" id="exampleFormControlInput2" value={this.state.editEmployee.lastname} required onChange={(event) => this.getLastName(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput3">Phone Number *<small id="emailHelp" className="form-text text-muted">(Up to 15 characters)</small></label>
              <input name="phone" type="text" className="form-control" id="exampleFormControlInput3" value={this.state.editEmployee.phone} required onChange={(event) => this.getPhone(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput4">Email Address *</label>
              <input name="email" type="email" className="form-control" id="exampleFormControlInput4" value={this.state.editEmployee.email} required onChange={(event) => this.getEmail(event)} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1">Works Under</label>
              <select name="worksUnder" className="form-control" id="exampleFormControlSelect1" onChange={(event) => this.getBoss(event)} >
                <option selected disabled>{this.state.editEmployee.work_under_name} </option>
                {employees}
                <option value="nobody" >Nobody</option>
              </select>
            </div>
            <button type="button" className="btn btn-secondary mr-3" onClick={() => this.backToShow()} >Back</button>
            <button type="button" className="btn btn-primary" onClick={() => this.editEmployee()} >Save</button>
          </form>
        </div>
      </div>
    );
  };
};

export default Edit;