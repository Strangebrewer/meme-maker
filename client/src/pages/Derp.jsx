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

    /**
     * keep this function (decodeUtf8) as a reference to encoding and decoding as Utf8 - corresponding backend code is:
     *      return unescape(encodeURIComponent(html));
     * The HTML passed in is "$.html()" constructed by cheerio
     */     
    // function decodeUtf8(item) {
    //     return decodeURIComponent(escape(item));
    // }

    function calcDimenionsAndShit() {
        const actualWidth = 960;
        const actualHeight = 540;
        let xDiff = html.width - actualWidth;
        let yDiff = html.height - actualHeight;
        let scale = 1;

        if (html.width > actualWidth && html.height > actualHeight) {
            if (xDiff > yDiff)
                scale = actualWidth / html.width;
            else
                scale = actualHeight / html.height;
        } else if (html.width > actualWidth && html.height < actualHeight) {
            scale = actualWidth / html.width;
        } else if (html.width < actualWidth && html.height > actualHeight) {
            scale = actualHeight / html.height;
        }

        const scaledWidth = html.width * scale;
        const scaledHeight = html.height * scale;
        const heightDiff = html.height - scaledHeight;
        const widthDiff = html.width - scaledWidth;

        const styles = {
            width: html.width + 'px',
            height: html.height + 'px',
            transform: `scale(${scale})`,
            position: 'absolute',
            top: `-${heightDiff * scale}px`,
            left:  `-${widthDiff * scale}px`,
        }

        return styles;
    }

    const styles = calcDimenionsAndShit();

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

                        {/* this iframe corresponds to the Utf8 encoded stuff commented out above */}
                        {/* <iframe srcDoc={html.render} style={styles} frameBorder="0"></iframe> */}
                        <iframe src={html.url} style={styles} frameBorder="0"></iframe>
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
