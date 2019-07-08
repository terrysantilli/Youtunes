pragma solidity ^0.4.25;

contract SongFactory {
    address[] public deployedSongs;
    //Song[] public allDeployedSongs;

    function createSong(string _songName, string _songAudio, uint _salePrice, address[] _participantAddresses, uint[] _participantPercentages) public {
        address newSong = new Song(_songName, _songAudio, _salePrice, _participantAddresses, _participantPercentages, msg.sender);
        deployedSongs.push(newSong);
        //allDeployedSongs.push(Song(newSong));
    }

    function getDeployedSongs() public view returns (address[]) {
        return deployedSongs;
    }

    // function getPurchasedSongs(address _address) public view returns(Song[]){
    //     Song[] songs;

    //     for(uint i = 0; i < allDeployedSongs.length; i++){
            
    //     }
    // }
}

contract Song {

    struct Participant {
        address participant;
        uint percentage;
    }

    string public songName;
    string public songAudio;
    uint public salePrice;
    address public manager;
    mapping(address => bool) public purchasers;
    Participant[] public participants;

    constructor(string _songName, string _songAudio, uint _salePrice, address[] _participantAddresses, uint[] _participantPercentages, address uploader) public {
        
        uint totalPercentage = 0;
        for(uint i = 0; i < _participantPercentages.length; i++){
            totalPercentage += _participantPercentages[i];
        }

        require(totalPercentage <= 100);

        songName = _songName;
        songAudio = _songAudio;
        salePrice = _salePrice;
        manager = uploader;

        for(uint j = 0; j < _participantAddresses.length; j++){
            participants.push(Participant({
                participant: _participantAddresses[j],
                percentage: _participantPercentages[j]
            }));
        }
    }

    function purchase() public payable {
        require(msg.value >= salePrice);
        require(!purchasers[msg.sender]);
        purchasers[msg.sender] = true;
        uint purchaseAmount = address(this).balance;

        for(uint i = 0; i < participants.length; i++){
            participants[i].participant.transfer((purchaseAmount * participants[i].percentage)/100);
        }
    }

    function listen() public view returns (string) {
        require(purchasers[msg.sender]);
        return songAudio;
    }

}