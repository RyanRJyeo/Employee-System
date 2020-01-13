import React from 'react';
import axios from 'axios';
import './show.css';
import Nav from '../nav/nav';


class Show extends React.Component {
  constructor(){
      super();
      this.state = {
          selectedEmployee: "",
          bosses: []
      };
  };

  componentDidMount(){

    //Get selected employee data and set to state
    //---------------------------------------------
    let requestID = this.props.match.params.id;

    axios.get("/api/employee/"+requestID)
      .then(response =>{
        let selectedEmployee = response.data.selectedEmployee[0];
        console.log({selectedEmployee});
        this.setState({ selectedEmployee });
      })
      .catch(err => console.log(err));
  };

  componentDidUpdate(){

    // Check if there's any boss
    //---------------------------------------------
    if(this.state.selectedEmployee.work_under_id && this.state.bosses.length === 0){
      this.getBosses(this.state.selectedEmployee.work_under_id);
    };

  };


  getBosses(id){

    // Get boss data and push it to array in state, then check if that boss has a boss, if yes then run this function again, if not then exit from the function
    //---------------------------------------------
    let param = "" + id

    axios.get("/api/employee/"+param)
      .then(response =>{
        let selectedEmployee = response.data.selectedEmployee[0];
        let bosses = this.state.bosses;
        bosses.push(selectedEmployee);
        this.setState({ bosses });
        if (selectedEmployee.work_under_id){
          this.getBosses(selectedEmployee.work_under_id);
        } else {
          return;
        };
      })
      .catch(err => console.log(err));
      console.log(this.state);
  };

  render(){

    // Update render html based on states
    //---------------------------------------------
    let name = this.state.selectedEmployee.firstname + " " + this.state.selectedEmployee.lastname
    let phone = this.state.selectedEmployee.phone
    let email = this.state.selectedEmployee.email
    let image = this.state.selectedEmployee.image || "https://i.pinimg.com/originals/19/b8/d6/19b8d6e9b13eef23ec9c746968bb88b1.jpg";
    let works_under;
    if(this.state.bosses.length === 0){
      works_under = "Nil";
    } else {
      works_under =this.state.bosses.map(x=>{
        return  <span> <a href={`/show/${x.id}`}>{x.firstname}</a> >> </span>
      });
    };
    //---------------------------------------------



    return (
      <div>

          <Nav/>

          <h1 className="title">Employee:  {this.state.selectedEmployee.firstname}</h1>

            <div className="card border-secondary mb-3">
              <img src={image} className="card-img-top profile-pic" alt="user-profile" />
              <div className="card-body">
                <div className="card-header"><h2>{name}</h2></div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item list-group-item-action">{phone}</li>
                  <li className="list-group-item list-group-item-action">{email}</li>
                  <li className="list-group-item list-group-item-action">Works Under: {works_under}</li>
                  <li className="list-group-item list-group-item-action"><button type="button" className="button4" ><a href={`/edit/${this.state.selectedEmployee.id}`}>Edit {this.state.selectedEmployee.firstname}</a></button></li>
                </ul>
              </div>
            </div>


      </div>
    );
  };
};

export default Show;