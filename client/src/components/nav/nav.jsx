import React from 'react';
import logo from "../../logo.svg"
import './nav.css';

const Main = ()=>(
  <main>

    <nav className="navbar navbar-dark bg-dark">
      <a className="navbar-brand" href="/employees">Employee System<img src={logo} className="App-logo" alt="logo" /></a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">

        </ul>
        <span className="navbar-text">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/employees">All Employees</a>
            </li>
            <li className="nav-item active">
              <a className="nav-link" href="/create">Create New Employee</a>
            </li>
          </ul>
        </span>
      </div>
    </nav>

  </main>

)

export default Main;