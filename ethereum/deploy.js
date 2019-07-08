const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledSongFactory = require('./build/SongFactory.json');

const provider = new HDWalletProvider(
    'add your mnemonic words here',
    'https://rinkeby.infura.io/v3/ENTER_YOUR_ENDPOINT_HERE'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledSongFactory.interface))
        .deploy({ data: '0x' + compiledSongFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    console.log(compiledSongFactory.interface);
    console.log('Contract deployed to ', result.options.address);
};

deploy();