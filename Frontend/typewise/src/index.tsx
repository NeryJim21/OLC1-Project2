import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import Navbar from './Components/Navbar/Navbar'
import TabBar from './Components/Tabs/TabBar'
import Tokens from './Components/Table/Tokens/Tokens'
import Errors from './Components/Table/Errors/Errors'
import AST from './Components/AST/ast'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Navbar/>
      <Routes>
        <Route  path="/" element={<TabBar/>} />
        <Route  path="/Errores" element={<Errors/>} />
        <Route  path="/Tokens" element={<Tokens/>} />
        <Route  path="/AST" element={<AST/>} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();
