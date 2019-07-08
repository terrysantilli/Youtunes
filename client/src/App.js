import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import SongListen from './components/songs/Listen';
import  SongUpload from './components/songs/Upload';
import  SongPurchase from './components/songs/Purchase';
import LoginForm from './components/LoginLayout';
import Signup from './components/Signup';
import Home from './components/Home';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="ui container">
        <BrowserRouter>
          <div>
            <Container>
            <Route path="/" exact component={LoginForm} />
            <Route path="/home" exact component={Home} />
            <Route path="/songs/upload" exact component={SongUpload} />
            <Route path="/songs/purchase" exact component={SongPurchase} />
            <Route path="/songs/listen" exact component={SongListen} />
            <Route path="/signup" exact component={Signup} />
            </Container>
          </div>
        </BrowserRouter>       
      </div>
    );
  }
}

export default App;
