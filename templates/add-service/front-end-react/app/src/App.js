import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Demo from './pages/Demo';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/demo">
            <Demo/>
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
