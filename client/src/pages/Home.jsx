import React from 'react';
import Header from '../components/elements/Header';

const Home = props => {
    return (
        <Header page="home" logout={props.logout} />
    )
}

export default Home;
