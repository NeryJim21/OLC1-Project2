import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';

import Navbar from './Components/Navbar/Navbar'
import TabBar from './Components/Tabs/TabBar'
import Tokens from './Components/Table/Tokens/Tokens'
import Errors from './Components/Table/Errors/Errors'
import AST from './Components/AST/ast'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar/>
      <Switch>
        <Route exact path="/" component={TabBar} />
        <Route exact path="/Errores" component={Errors} />
        <Route exact path="/Tokens" component={Tokens} />
        <Route exact path="/AST" component={AST} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
