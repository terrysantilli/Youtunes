import web3 from './web3';
import Song from './ethereumBuild/Song.json';

export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(Song.interface),
        address
    );
};