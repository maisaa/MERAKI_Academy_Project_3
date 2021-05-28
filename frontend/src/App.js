import React from 'react';
import './App.css';
import { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Navigation } from './components/navigation/Navigation';
import { Dashboard } from './components/dashboard/Dashboard';
import { Register} from './components/register/Register';
import { Login } from './components/login/Login';


const App =() => {


  const [token, setToken] = useState('');
  console.log(".....ttt", token)
  return (
    <div className="App">
      <h1>App</h1>
      <Navigation token={token}/>
      <Switch>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/login" render={()=> <Login setToken={setToken}/>}/>
      <Route exact path="/dashboard" render={()=> <Dashboard token={token}/>} />
      <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}

export default App;

