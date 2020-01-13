import React from 'react';
import './start.css';

class Start extends React.Component {

  render(){
    return (
      <div>
        <div className="showcase">
          <button type="button" className="button"> <a href="/employees">Welcome</a> </button>
        </div>
      </div>
    );
  };
};

export default Start;