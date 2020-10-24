import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiHeart, mdiHeartOutline, mdiTrashCanOutline } from '@mdi/js';

import Header from '../components/elements/Header';
import UploadSVGButton from '../components/images/UploadSVGButton';
import UploadImgButton from '../components/images/UploadImgButton';
import API from '../api';

import { PageWrapper } from './styles'; 

const Images = props => {
    const [images, setImages] = useState(null);
    const [svgs, setSvgs] = useState(null);

    useEffect(() => {
        async function fetchImages() {
            const results = await API.image.get();
            setImages(results.data);
        }
        fetchImages();
    }, []);

    useEffect(() => {
        async function fetchSVGs() {
            const results = await API.svg.get();
            setSvgs(results.data);
        }
        fetchSVGs();
    }, []);

    async function toggleFavoriteImg(img) {
        await API.image.edit({ ...img, favorite: !img.favorite });
        const results = await API.image.get();
        setImages(results.data);
    }

    async function toggleFavoriteSvg(svg) {
        await API.svg.edit({ ...svg, favorite: !svg.favorite });
        const results = await API.svg.get();
        setSvgs(results.data);
    }

    async function deleteSvg(svg) {
        await API.svg.destroy(svg._id);
        const results = await API.svg.get();
        setSvgs(results.data);
    }

    async function deleteImage(img) {
        await API.image.destroy(img._id);
        const results = await API.image.get();
        setImages(results.data);
    }

    return (
        <PageWrapper>
            <Header page="Images" logout={props.logout} />

            <Buttons>
                <UploadImgButton setImages={img => setImages([...images, img])} />
                <UploadSVGButton setSvgs={svg => setSvgs([...svgs, svg])} />
            </Buttons>

            {images && <Content>
                <h2 style={{ width: '100%' }}>Images</h2>
                {images.map((image, i) => {
                    return (
                        <Card key={image._id}>
                            <Icon
                                size={1}
                                className="heart-icon"
                                color={image.favorite ? 'red' : '#dedede'}
                                path={image.favorite ? mdiHeart : mdiHeartOutline}
                                onClick={() => toggleFavoriteImg(image)}
                            />
                            <Icon
                                size={1}
                                className="delete-icon"
                                color="orange"
                                path={mdiTrashCanOutline}
                                onClick={() => deleteImage(image)}
                            />
                            <img src={image.midImage} />
                        </Card>
                    )
                })}
            </Content>}

            {svgs && <Content>
                <h2 style={{ width: '100%' }}>SVGs</h2>
                {svgs.map((svg, i) => {
                    return (
                        <Card key={svg._id}>
                            <Icon
                                size={1}
                                className="heart-icon"
                                color={svg.favorite ? 'red' : '#dedede'}
                                path={svg.favorite ? mdiHeart : mdiHeartOutline}
                                onClick={() => toggleFavoriteSvg(svg)}
                            />
                            <Icon
                                size={1}
                                className="delete-icon"
                                color="orange"
                                path={mdiTrashCanOutline}
                                onClick={() => deleteSvg(svg)}
                            />
                            <div dangerouslySetInnerHTML={{__html: svg.svg }}></div>
                        </Card>
                    )
                })}
            </Content>}
        </PageWrapper>
    )
}

export default Images;

const Buttons = styled.div`
    text-align: center;
    margin: 15px 0;

    button {
        background-color: white;
        border: 2px solid ${props => props.theme.nRed};
        border-radius: 5px;
        box-shadow: 5px 5px 5px #222,
            inset 1px 1px 5px ${props => props.theme.blue},
            inset -1px -1px 5px ${props => props.theme.blue};
        color: ${props => props.theme.purple};
        cursor: pointer;
        height: 40px;
        outline: none;
        width: 120px;
    }

    button:first-of-type {
        margin-right: 20px;
    }
`;

const Content = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 1100px;
    margin: 35px auto 0 auto;

    h2 {
        font-size: 22px;
        color: ${props => props.theme.nBlue};
        text-align: center;
        border-bottom: 1px solid ${props => props.theme.blue};
        padding-bottom: 10px;
        margin: 0 20px;
    }
`;

export const Card = styled.div`
    display: flex;
    height: 180px;
    width: 180px;
    position: relative;
    background: linear-gradient(to bottom right, #000, #BC13FE, #BC13FE55, #fff, #fff, #4666FF55, #4666FF, #000);
    margin: 20px;
    border: 1px solid ${props => props.theme.purple};
    box-shadow: 10px 10px 10px #333;

    img {
        max-height: 100%;
        max-width: 100%;
        align-self: center;
        margin: auto;
        padding: 10px;
    }

    div {
        height: 180px;
        width: 180px;
        align-self: center;
        margin: auto;
        padding: 10px;
        
        svg {
            height: 100%;
            width: 100%;
        }
    }

    .heart-icon, .delete-icon {
        position: absolute;
        top: 15px;
        z-index: 99;
        cursor: pointer;
    }

    .heart-icon {
        right: 15px;
    }

    .delete-icon {
        left: 15px;
    }
`;
