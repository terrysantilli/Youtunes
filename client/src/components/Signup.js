import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import logo from '../logo.jpg';
import { BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom';


class Signup extends Component {

  state = {
    userName: '',
    email: '',
    password1: '',
    password2: '',
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
      
    if(this.state.password1 !== this.state.password2){
        this.setState({ message: 'Passwords do not match' });
    }else{
        
        // Post request to backend
        fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: this.state.userName,
          password: this.state.password1,
          email: this.state.email
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
    }
  };

  render(){
    if(this.state.loginSuccess){
      return <Redirect to='/home' />
    }
    return (
      <div>
        <div style={{ marginTop: '50px', textAlign: 'center', paddingRight: '30px' }}>
          <Link to="/" className="item">
            <Header as='h1' color='teal' textAlign='center'>
              <Image src={logo}/>
              <p style={{ display: 'inline-block', color: 'LightSeaGreen' }}>You<span style={{ color: '#a0a0a0'}}>Tunes</span></p>
            </Header>
          </Link>          
        </div>
        <hr
          style={{
            marginTop: '10px',
            color: 'LightSeaGreen',
            backgroundColor: 'LightSeaGreen',
          }}
        />
      <div className='login-form' style={{ marginTop: '30px' }}>
    {/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}
    <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>
    <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          Register a new account
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
              icon='mail'
              iconPosition='left'
              placeholder='E-mail address'
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={this.state.password1}
              onChange={event => this.setState({ password1: event.target.value })}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Confirm Password'
              type='password'
              value={this.state.password2}
              onChange={event => this.setState({ password2: event.target.value })}
            />
              {/* <Link to="/home" className="item"> */}
                <Button id='formButton' color='teal' fluid size='large'>
                  Sign Up
                </Button>
              {/* </Link> */}
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
    <h1>{this.state.message}</h1>
  </div>
  </div>
    );
  }
}

export default Signup;