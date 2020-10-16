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
            const results = await API.image.get();
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

    function insertImage() {
        addImage(getFabric, getScale, pushVersion, selected);
        setShow(false);
    }

    function setAsBackground(position) {
        switch (position) {
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
        <>
            <Button onClick={insertImage}>add to canvas</Button>
            <p style={{ textAlign: 'center', marginTop: '25px' }}>set as background:</p>
            <Buttons>
                <button onClick={() => setAsBackground('fit')}>fit</button>
                <button onClick={() => setAsBackground('stretch')}>stretch</button>
                <button onClick={() => setAsBackground('fill')}>fill</button>
            </Buttons>
            <p style={{ textAlign: 'center', marginTop: '15px' }}>or:</p>
            <Button center onClick={setAsBackground}>conform canvas to image</Button>
        </>
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

const ImageContainer = styled.div`
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

const Buttons = styled.div`
    display: flex;
    justify-content: space-between;

    button {
        background-color: #1d928c;
        border: none;
        border-radius: 5px;
        color: #fff;
        font-size: ${props => props.full && '1.8rem'};
        height: ${props => props.full && '40px'};
        margin: 10px 0;
        outline: transparent;
        padding: 8px 12px;
        text-shadow: 0 0 5px #000;
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        width: 28%;
    }
`;

const Button = styled.button`
    background-color: #1d928c;
    border: none;
    border-radius: 5px;
    color: #fff;
    display: block;
    font-size: ${props => props.full && '1.8rem'};
    height: ${props => props.full && '40px'};
    margin: 10px auto;
    outline: transparent;
    padding: 8px 12px;
    text-shadow: 0 0 5px #000;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    width: 100%;
`;
