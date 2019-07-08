import web3 from './web3';
import SongFactory from './ethereumBuild/SongFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(SongFactory.interface),
    'YOUR_DEPLOYED_CONTRACT_ADDRESS'
)

export default instance;