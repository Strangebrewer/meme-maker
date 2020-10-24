import React, { useEffect } from 'react';
import Header from '../components/elements/Header';

import { PageWrapper } from './styles';

const Home = props => {    
    return (
        <PageWrapper>
            <Header page="home" logout={props.logout} />
        </PageWrapper>
    )
}

export default Home;
