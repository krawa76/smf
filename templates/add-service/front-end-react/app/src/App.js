import React from 'react';
import messages from './messages';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from 'react-router-dom';
import './App.css';
import Flash from './components/Flash';
import Home from './pages/Home';
import Kittens from './pages/Kittens';

window.flash = (message, type= 'success') => messages.emit('flash', ({message, type}));

function App() {
  return (
    <Router>
      <div className="App">
        <Flash/>
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
