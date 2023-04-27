import React from 'react'
import {Link} from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
    return (
        <nav className="Navbar">
          <h1 className="Navbar-name">Syscompiler</h1>
            <ul className="Navbar-menu">
              <li>
                <Link to="/" className="Navbar-item">Editor</Link>
              </li>
              <li>
                <Link to="/Tokens" className="Navbar-item">Tokens</Link>
              </li>
              <li>
                <Link to="/Errores" className="Navbar-item">Errores</Link>
              </li>
              <li>
                <Link to="/AST" className="Navbar-item">AST</Link>
              </li>
            </ul>
      </nav>
    )
}

export default Navbar