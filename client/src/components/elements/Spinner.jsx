import React from 'react';
import styled from 'styled-components';
import { ScaleLoader } from 'react-spinners';

const Spinner = () => {
    return (
        <LoadingContainer>
            <ScaleLoader
                color={'#800080'}
                height={170}
                width={12}
                margin="15px"
                radius={4}
            />
        </LoadingContainer>
    );
}

export default Spinner;

const LoadingContainer = styled.div`
    background-color: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
`;