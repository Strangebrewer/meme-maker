import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import API from '../api';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';

import Header from '../components/elements/Header';
import Spinner from '../components/elements/Spinner';

import { PageWrapper } from './styles';

const Derp = props => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [html, setHtml] = useState('');

    useEffect(() => {
        fetchRender();
    }, []);

    async function fetchRender() {
        const { name } = props.match.params;
        const { data } = await API.content.getRender(name);
        setHtml(data);
        setTimeout(() => setLoading(false), 1000);
    }

    function goBackNomsayn() {
        history.push('/canvas');
    }

    return (
        <PageWrapper>
            {loading
                ? <Spinner />
                : (
                    <>
                        <BackButton className="back-button" onClick={() => goBackNomsayn()}>
                            <Icon
                                size={1.5}
                                className="back-arrow"
                                color="#4666FF"
                                path={mdiArrowLeft}
                            />
                        </BackButton>

                        <RenderWrapper width={html.width} height={html.height}>
                            <div dangerouslySetInnerHTML={{ __html: html.render }}></div>
                        </RenderWrapper>
                    </>
                )}
        </PageWrapper>
    )
}

export default Derp;

const BackButton = styled.button`
    display: block;
    margin: auto;
    width: 50px;
    height: 50px;
    padding-top: 4px;
    border-radius: 50%;
    border: none;
    outline: none;
    background: transparent;
    box-shadow: 1px 1px 6px #bbb;
    z-index: 9;
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    opacity: .2;

    &:hover {
        opacity: 1;
    }
`;

const RenderWrapper = styled.div`
    display: flex;
    min-height: 100vh;

    div {
        width: ${props => props.width}px;
        height: ${props => props.height}px;
        margin: auto;
    }
`;