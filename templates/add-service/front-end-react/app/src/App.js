import React from 'react';
import messages from './messages';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from 'react-router-dom';
import Flash from './components/Flash';
import Nav from './components/Nav';
import Home from './pages/Home';
import Kittens from './pages/Kittens';
import NotFound from './pages/NotFound';

window.flash = (message, type= 'success') => messages.emit('flash', ({message, type}));

function App() {
  return (
    <Router>
      <div className="container pt-4">
        <Flash/>
        <Nav/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/kittens" component={Kittens} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
