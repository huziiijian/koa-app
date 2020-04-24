import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>cesdc </h1>
        <Switch>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Footer />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
