import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Start from './start/start';
import Employees from './employees/employees';
import Create from './create/create';
import Show from './show/show';
import Edit from './edit/edit';

const Main = ()=>(
  <main>
    <Switch>

      <Route exact path='/' component={Start} />
      <Route exact path='/employees' component={Employees} />
      <Route exact path='/create' component={Create} />
      <Route exact path='/show/:id' component={Show} />
      <Route exact path='/edit/:id' component={Edit} />

    </Switch>
  </main>

)

export default Main;