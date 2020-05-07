import React from 'react';

const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-2">
    <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
        <li className="nav-item">
            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="/kittens">Kittens</a>
        </li>
        </ul>
    </div>
    </nav>
  );
}

export default Nav;
