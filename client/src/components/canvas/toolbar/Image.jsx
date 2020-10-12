import React, { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiImageSearchOutline } from '@mdi/js';
import styled from 'styled-components';

import API from '../../../api';
import Modal from '../../elements/Modal';
import { addImage, setBackgroundImage } from '../fabric-handlers/image';

import { ToolbarButton } from '../styles';

const ImageToolbar = ({ getFabric, getScale, pushVersion }) => {
    const [show, setShow] = useState(false);
    const [images, setImages] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

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

    function addAnImage(image) {
        if (!image.largeImage) {
            image = selectedImage;
        }

        console.log('image:::', image);
        setBackgroundImage(getFabric, getScale, pushVersion, image);
        setShow(false);
    }

    const modalContent = (
        <ImageContainer>
            {images && images.map(image => {
                return (
                    <div
                        key={image._id}
                        style={{
                            boxShadow: selectedImage && image._id === selectedImage._id
                                ? '0 0 20px #ff00ff'
                                : '0 0 10px #999'
                        }}
                    >
                        <img
                            src={image.thumbnail}
                            onClick={() => setSelectedImage(image)}
                            onDoubleClick={() => addAnImage(image)}
                        />
                    </div>
                )
            })}
        </ImageContainer>
    )

    return (
        <>
            <Modal
                show={show}
                close={closeModal}
                callback={addAnImage}
                content={modalContent}
            />

            <ToolbarButton onClick={() => setShow(true)} title="add image">
                <Icon
                    path={mdiImageSearchOutline}
                    size={1.2}
                    id="backward-icon"
                />
            </ToolbarButton>
        </>
    )
}

export default ImageToolbar;

const ImageContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    max-width: 800px;

    div {
        display: flex;
        border: 1px solid #aaa;
        margin: 0 5px;
        height: 100px;
        width: 100px;

        img {
            max-height: 100%;
            max-width: 100%;
            align-self: center;
            margin: auto;
        }
    }
`;