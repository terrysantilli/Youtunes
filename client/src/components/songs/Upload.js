import React, { Component } from 'react';
import { Container, Form, Input, Button } from 'semantic-ui-react';
import web3 from '../../web3';
import songFactory from '../../songFactory';
import NavHeader from '../NavHeader';

class SongNew extends Component {

    state = {
        songName: '',
        songAudio: '',
        salePrice: '',
        participantAddresses: [],
        participantPercentages: [],
        currentParticipantAddress: '',
        currentParticipantPercentage: '',
        errorMessage: '',
        loading: false,
        message: ''
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, message: 'Processing your request... This may take several seconds' });

        try {
            const accounts = await web3.eth.getAccounts();
            this.state.participantAddresses.push(this.state.currentParticipantAddress);
            this.state.participantPercentages.push(this.state.currentParticipantPercentage);
            console.log(this.state.songName + " " + this.state.songAudio + " " +  web3.utils.toWei(this.state.salePrice, 'ether') + " " + this.state.participantAddresses + " " + this.state.participantPercentages + " " + accounts[0]);
            await songFactory.methods.createSong(this.state.songName, this.state.songAudio, web3.utils.toWei(this.state.salePrice, 'ether'), this.state.participantAddresses, this.state.participantPercentages).send({ from: accounts[0] });
        }catch(err) {
            console.log(err.message);
            this.setState({ errorMessage: err.message });
            this.state.participantAddresses.pop();
            this.state.participantPercentages.pop();
        }

        this.setState({ loading: false, message: '' });

        if(!this.state.errorMessage){
            alert("Your song was successfully uploaded!");
        }else{
            alert("There was an issue processing your request\n" + this.state.errorMessage);
        }

        this.setState({ errorMessage: '' })
    };

    addParticipant = () => {
        var formGroup = document.getElementById('formGroupId');
        var formGroupClone = formGroup.cloneNode(true);
        var nodes = formGroupClone.getElementsByTagName('*');
        for(var i = 0; i < nodes.length; i++){
            nodes[i].disabled = true;
        }
        var oldElement = document.getElementById('formId');
        oldElement.insertBefore(formGroupClone, oldElement.lastChild);
        this.state.participantAddresses.push(this.state.currentParticipantAddress);
        this.state.participantPercentages.push(this.state.currentParticipantPercentage);
        var nodes2 = formGroup.getElementsByTagName('*');
        for(var i = 0; i < nodes2.length; i++){
            nodes2[i].value = '';
        }
    };

    removeParticipant = () => {
        
    };

    render() {
        return(
            <Container>
                <NavHeader />
                    <h2>Upload a Song</h2>
                    <Form id='formId' onSubmit={this.onSubmit}>
                    <Form.Field>
                            <label>Song Name</label>
                            <Input
                                value={this.state.songName}
                                onChange={event => this.setState({ songName: event.target.value })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Song Audio (currently only text)</label>
                            <Input
                                value={this.state.songAudio}
                                onChange={event => this.setState({ songAudio: event.target.value })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Sale Price (ether)</label>
                            <Input
                                value={this.state.salePrice}
                                onChange={event => this.setState({ salePrice: event.target.value })}
                            />
                        </Form.Field>
                        <Form.Group id='formGroupId'>
                            <Form.Input width="10" fluid label='Participant Address' value={this.state.currentParticipantAddress}
                                        onChange={event => this.setState({ currentParticipantAddress: event.target.value })}/>
                            <Form.Input width="10" fluid label='Participant Percentage' value={this.state.currentParticipantPercentage}
                                        onChange={event => this.setState({ currentParticipantPercentage: event.target.value })}/>
                            <Form.Button fluid label="Additional?" size="medium" color="green" type="button" icon='plus circle' onClick={this.addParticipant} />                          
                            {/* <Form.Button label="Remove" size="medium" color="red" type="button" icon='minus circle' onClick={this.removeParticipant} /> */}
                        </Form.Group>
                        <Button primary id='formButton' loading={this.state.loading}>Upload!</Button>
                    </Form>
                <h2>{this.state.message}</h2>
                </Container>
        );
    }
}

export default SongNew;