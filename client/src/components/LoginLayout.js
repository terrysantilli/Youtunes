import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import logo from '../logo.jpg';
import { BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom';

class LoginForm extends Component {

  state = {
    userName: '',
    password: '',
    salePrice: '',
    participantAddresses: [],
    participantPercentages: [],
    currentParticipantAddress: '',
    currentParticipantPercentage: '',
    errorMessage: '',
    loading: false,
    message: '',
    loginSuccess: false
  }

  onSubmit = async (event) => {
      event.preventDefault();
      // Post request to backend
      fetch('/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: this.state.userName,
          password: this.state.password
        }),
      }).then(res => res.json())
        .then(json => {
          if(json.success) {
            this.setState({
              loginSuccess: true
            });
          }else {
            this.setState({
              message: json.message
            })
          }
        });

  };

  render(){
    if(this.state.loginSuccess){
      return <Redirect to={{pathname: '/home', state: {userName: this.state.userName}}}/>
    }
    return (
      <div>
        <div style={{ marginTop: '50px', textAlign: 'center', paddingRight: '30px' }}>
          <Header as='h1' color='teal' textAlign='center'>
            <Image src={logo} />
            <p style={{ display: 'inline-block', color: 'LightSeaGreen' }}>You<span style={{ color: '#a0a0a0'}}>Tunes</span></p>
          </Header>          
        </div>
        <hr
          style={{
            marginTop: '10px',
            color: 'LightSeaGreen',
            backgroundColor: 'LightSeaGreen',
          }}
        />
      <div className='login-form' style={{ marginTop: '30px' }}>    
      <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            Log-in to your account
          </Header>
          <Form size='large' onSubmit={this.onSubmit} >
            <Segment stacked>
              <Form.Input
                fluid
                icon='user'
                iconPosition='left'
                placeholder='Username'
                value={this.state.userName}
                onChange={event => this.setState({ userName: event.target.value })}
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                value={this.state.password}
                onChange={event => this.setState({ password: event.target.value })}
              />
                {/* <Link to="/home" className="item"> */}
                  <Button id='formButton' color='teal' fluid size='large'>
                    Login
                  </Button>
                {/* </Link> */}
            </Segment>
          </Form>
          <Message>
            New to us? <a href='/signup'>Sign Up</a>
          </Message>
        </Grid.Column>
      </Grid>
      <h1>{this.state.message}</h1>
    </div>
    </div> 
    );
  }
}

export default LoginForm;