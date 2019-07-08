import React, { Component } from 'react';
import { Container, Form, Input, Button, Header, Image } from 'semantic-ui-react';
import NavHeader from './NavHeader';
import logo from '../logo.jpg';

class Home extends Component {
  render() {
    console.log("username: " + this.props.location.state.username);
    return (
      <Container>
            <div>
              <NavHeader />
              <Header as='h1' color='teal' textAlign='center'>
                <p style={{ display: 'inline-block', color: 'LightSeaGreen' }}>Welcome to YouTunes!<br/>Select from the options located in the header</p>
              </Header>
            </div>
      </Container>
    );
  }
}

export default Home;
