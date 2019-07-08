import React, { Component } from 'react';
import web3 from '../../web3';
import { Button, Container, Card } from 'semantic-ui-react';
import SongFactory from '../../songFactory';
import Song from '../../song';
import NavHeader from '../NavHeader';

class SongListen extends Component {

    state = {
        songs: [],
        results: {},
        purchasedSongs: []
    }

    async componentDidMount(props) {
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];
        const songs = await SongFactory.methods.getDeployedSongs().call();
        let purchasedSongs = [];
        let songNames = [];
        for(var i = 0; i < songs.length; i++){
            var song = Song(songs[i]);
            let isPurchaser = await song.methods.purchasers(userAddress).call();
            if(isPurchaser){
                purchasedSongs.push(song.options.address);
                var songName = await song.methods.songName().call();
                songNames.push(songName);
            }
        }

        var results = {};
        purchasedSongs.forEach((key, j) => results[key] = songNames[j]);
        this.setState({ songs: songs, results: results, purchasedSongs: purchasedSongs })
        // return { songs: songs, results: results, purchasedSongs: purchasedSongs };
    }

    async listen(address) {    
        const song = Song(address);
        const accounts = await web3.eth.getAccounts();
        const songAudio = await song.methods.listen().call({ from: accounts[0] });
        alert(songAudio);
            
        
    }

    renderSongs() {
        const items = this.state.purchasedSongs.map(address => {            
            return {
                
                header: this.state.results[address],
                description: (
                    // <Link route={`/songs/${address}`}>
                    //     <a>Get Song</a>                        
                    // </Link>
                    <Button primary onClick={() => this.listen(address)}>Listen</Button>                    
                ),
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

export default SongListen;