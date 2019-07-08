import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Image } from 'semantic-ui-react';
import logo from '../logo2.png';

const NavHeader = () => {
    return (
        <div className="ui secondary pointing menu">
            <Link to="/home" className="item">
                <Header as='h4' color='teal' textAlign='center'>
                    <Image src={logo} />
                    <p style={{ display: 'inline-block', color: 'LightSeaGreen', verticalAlign: 'sub'}}>You<span style={{ color: '#a0a0a0'}}>Tunes</span></p>
                </Header>
            </Link>
            <div className="right menu">
                <Link to="/songs/upload" className="item">
                    <span style={{ color: '#a0a0a0', fontWeight: 'bold' }}>Upload</span>
                </Link>
                <Link to="/songs/purchase" className="item">
                    <span style={{ color: '#a0a0a0', fontWeight: 'bold' }}>Get Songs</span>
                </Link>
                <Link to="/songs/listen" className="item">
                    <span style={{ color: '#a0a0a0', fontWeight: 'bold' }}>Listen</span>
                </Link>
                <Link to="/" className="item">
                    <span style={{ color: '#a0a0a0', fontWeight: 'bold' }}>Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default NavHeader;