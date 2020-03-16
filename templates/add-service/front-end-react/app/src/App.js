import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Kittens from './pages/Kittens';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/kittens">
            <Kittens/>
          </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
