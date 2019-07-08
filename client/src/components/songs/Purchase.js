import React, { Component } from 'react';
import SongFactory from '../../songFactory';
import Song from '../../song';
import { Container, Card, Button } from 'semantic-ui-react';
import web3 from '../../web3';
import NavHeader from '../NavHeader';

class SongPurchase extends Component {
    
    state = {
        songs: [],
        results: {},
        loading: false,
        errorMessage: ''
    }
    
    async componentDidMount(){
        const songs = await SongFactory.methods.getDeployedSongs().call();
        let songNames = [];
        let songPrices = [];
        for(var i = 0; i < songs.length; i++){
            
            var song = Song(songs[i]);
            var songName = await song.methods.songName().call();
            var songPrice = await song.methods.salePrice().call();
            songNames.push(songName);
            songPrices.push(songPrice);
        }

        var results = {};
        songs.forEach((key, j) => results[key] = [songNames[j], songPrices[j]]);
        this.setState({ songs: songs, results: results});
    }

    async purchaseSong(address) {
        const accounts = await web3.eth.getAccounts();
        const song = Song(address);
        const purchased = await song.methods.purchasers(accounts[0]).call();

        if(purchased){
            alert("You have already purchased this song. Please visit the 'listen' page to listen.");
        }else{
            this.setState({ loading: true });
            const salePrice = await song.methods.salePrice().call();
            try{
                await song.methods.purchase().send({ from: accounts[0], value: salePrice });
            } catch (err) {
                console.log(err);
                this.setState({ errorMessage: err.message });
            }

            this.setState({ loading: false });

            if(!this.state.errorMessage){
                alert("Your purchase was successful! Visit the listen page to access your songs.");
            }else{
                alert("There was an error processing your request.\n" + this.state.errorMessage);
            }
            this.setState({ errorMessage: '' });
        }
        
    };

    renderSongs() {
        const items = this.state.songs.map(address => {         
            return {
                header: this.state.results[address][0],
                description: (
                    <Button primary loading={this.state.loading} onClick={() => this.purchaseSong(address)}>Get Song</Button>                    
                ),
                meta: web3.utils.fromWei(this.state.results[address][1], "ether") + " eth",
                fluid: true
            };
        });
        return <Card.Group items = {items} />
    }

    render() {
        return(
            <Container>
                <div>
                    <NavHeader />
                    {this.renderSongs()}
                </div>
            </Container>
        );
    }
}

export default SongPurchase;