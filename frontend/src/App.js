import React from 'react';
import './App.css';
import { Register} from './components/register/Register';
import { Login } from './components/login/Login';
import{ Link, Route } from 'react-router-dom';


const App =() => {
  return (
    <div className="App">
      <h1>App</h1>
      <Navigation/>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/login" component={Login}/>
    </div>
  );
}

const Navigation = () =>{
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <Link to="/login"> Login </Link>
      <Link to="/Register"> Register </Link>
    </div>
  )
}

export default App;

