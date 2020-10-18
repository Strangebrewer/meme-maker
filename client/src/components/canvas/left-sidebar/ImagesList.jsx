import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import API from '../../../api';
import Modal from '../../elements/Modal';

import {
    addImage,
    setBackgroundImageConform,
    setBackgroundImageFill,
    setBackgroundImageFit,
    setBackgroundImageStretch,
} from '../fabric-handlers/image';

import { SidebarSection } from '../styles';

const ImagesList = ({ getFabric, getScale, pushVersion, setDimensions }) => {
    const [images, setImages] = useState(null);
    const [selected, setSelected] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        async function fetchImages() {
            const results = await API.image.get({ favorite: true });
            setImages(results.data);
        }
        fetchImages();
    }, []);

    function closeModal() {
        setShow(false);
    }

    function selectImage(image) {
        setSelected(image);
        setShow(true);
    }

    function insertImage(event) {
        const { value } = event.target;
        addImage(value, getFabric, getScale, pushVersion, selected);
        setShow(false);
    }

    function setAsBackground(event) {
        const { value } = event.target;
        switch (value) {
            case 'fill':
                setBackgroundImageFill(getFabric, getScale, pushVersion, selected)
                break;
            case 'fit':
                setBackgroundImageFit(getFabric, getScale, pushVersion, selected);
                break;
            case 'stretch':
                setBackgroundImageStretch(getFabric, getScale, pushVersion, selected);
                break;
            default:
                setBackgroundImageConform(getFabric, pushVersion, setDimensions, selected);
        }

        setShow(false);
    }
    
    const content = (
        <ContentContainer>
            <p>add to canvas:</p>
            <div>
                <button onClick={insertImage} value="largeImage">full</button>
                <button onClick={insertImage} value="midImage">mid</button>
                <button onClick={insertImage} value="thumbnail">thumb</button>
            </div>
            <p>or set as background:</p>
            <div>
                <button onClick={setAsBackground} value="fit">fit</button>
                <button onClick={setAsBackground} value="stretch">stretch</button>
                <button onClick={setAsBackground} value="fill">fill</button>
                <button onClick={setAsBackground} value="conform">conform canvas to image</button>
            </div>
        </ContentContainer>
    )

    return (
        <SidebarSection>
            <Modal
                show={show}
                close={closeModal}
                content={content}
            />

            <h3>Images</h3>
            {images && images.map((image, i) => {
                return (
                    <ImageContainer key={i}>
                        <img
                            src={image.thumbnail}
                            onDoubleClick={() => selectImage(image)}
                        />
                    </ImageContainer>
                )
            })}
        </SidebarSection>
    )
}

export default ImagesList;

export const ImageContainer = styled.div`
    display: flex;
    height: 110px;
    width: 110px;
    position: relative;
    background-color: #000;
    margin: 5px;
    border: 1px solid ${props => props.theme.purple};

    img {
        max-height: 100%;
        max-width: 100%;
        align-self: center;
        margin: auto;
    }
`;

const ContentContainer = styled.div`
    width: 300px;

    p {
        text-align: center;
    }

    p:last-of-type {
        margin-top: 25px;
    }

    div {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        button {
            background-color: #1d928c;
            border: none;
            border-radius: 5px;
            color: #fff;
            cursor: pointer;
            margin: 10px 0;
            outline: transparent;
            padding: 8px 12px;
            text-shadow: 0 0 5px #000;
            transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
            width: 28%;
        }

        button:nth-child(4) {
            width: 100%;
        }
    }
`;
