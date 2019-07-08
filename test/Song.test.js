const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledSong = require('../ethereum/build/Song.json');
const compiledSongFactory = require('../ethereum/build/SongFactory.json');

let song;
let accounts;
let songAddress;
let songFactory;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();

    songFactory = await new web3.eth.Contract(JSON.parse(compiledSongFactory.interface))
        .deploy({ data: compiledSongFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await songFactory.methods.createSong(
            'Johnny Cash: Ring of Fire',
            'I fell into a burning ring of fire',
            20000000000000000,
            [accounts[0], accounts[1]],
            [60, 40])
        .send({ from: accounts[0], gas: '1000000' });

    //[songAddress] syntax says that the function call is going to return an array and it wants to
    //assign the first element of that array into the variable campaignAddress
    [songAddress] = await songFactory.methods.getDeployedSongs().call();
    song = await new web3.eth.Contract(
        JSON.parse(compiledSong.interface),
        songAddress
    );

});

describe('Songs', () => {

    it('deploys a song factory and a song', () => {
        assert.ok(songFactory.options.address);
        assert.ok(song.options.address);
    });

    it('marks caller as song manager', async () => {
        const manager = await song.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('doesnt allow access to song audio before purchasing', async() => {
        try {
            const songAudio = await song.methods.listen().call();
            assert(false);
        } catch(err) {
            assert(err.results);
        }        
    });

    it('allows purchase of song', async() => {
        await song.methods.purchase().send({ from: accounts[0], value: '20000000000000000', gas: '1000000'});
        const isPurchaser = await song.methods.purchasers(accounts[0]).call();
        assert(isPurchaser);
    });

    it('allows access to song audio after purchasing', async() => {
        await song.methods.purchase().send({ from: accounts[0], value: '20000000000000000', gas: '1000000'});
        const songAudio = await song.methods.listen().call();
        assert.equal('I fell into a burning ring of fire', songAudio);
    });

    it('properly distributes correct amount of ether into correct accounts after purchase', async() => {
        let account0BalanceBefore = await web3.eth.getBalance(accounts[0]);
        let account1BalanceBefore = await web3.eth.getBalance(accounts[1]);

        await song.methods.purchase().send({ from: accounts[2], value: '20000000000000000', gas: '1000000'});
        
        let account0BalanceAfter = await web3.eth.getBalance(accounts[0]);
        let account1BalanceAfter = await web3.eth.getBalance(accounts[1]);

        const account0Difference = account0BalanceAfter-account0BalanceBefore;
        const account1Difference = account1BalanceAfter-account1BalanceBefore;

        assert(account0Difference >= (0.599 * 20000000000000000) && account0Difference <= (0.601 * 20000000000000000));
        assert(account1Difference >= (0.399 * 20000000000000000) && account1Difference <= (0.401 * 20000000000000000));
    });

});