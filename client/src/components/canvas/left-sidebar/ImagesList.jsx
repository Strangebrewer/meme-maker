import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiImageSearchOutline  } from '@mdi/js';

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
    const [imagesCopy, setImagesCopy] = useState(null);
    const [selected, setSelected] = useState(null);
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchImages() {
            const results = await API.image.get({ favorite: true });
            setImages(results.data);
        }
        fetchImages();
    }, []);

    function handleInputChange(e) {
        const { value } = e.target;
        setSearch(value);
    }

    async function find(e) {
        e.preventDefault();
        setImagesCopy(images);
        const response = await API.image.get({ normalizedName: search.toLowerCase() });
        setImages(response.data);
    }

    function clearSearch() {
        setSearch('');
        if (imagesCopy) setImages(imagesCopy);
    }

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

            <h3>Image Favorites</h3>

            <Form onSubmit={find}>
                <input type="text" name="search" value={search} placeholder="search by name" onChange={handleInputChange} />
                <button onClick={find} title="go">
                    <Icon path={mdiImageSearchOutline} size={1.3} />
                </button>
                {search.length ? <p onClick={clearSearch} title="clear search">&times;</p> : null}
            </Form>
            
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

const Form = styled.form`
    margin: 15px 0 10px 0;
    position: relative;
    height: 50px;
    width: 100%;

    input {
        background-color: transparent;
        border: none;
        border-bottom: 1px solid #ddd;
        color: white;
        font-size: 16px;
        outline: none;
        position: absolute;
        left: 10%;
        right: 0;
        padding: 6px 12px 8px 6px;
        width: 70%;
    }
    button {
        border: none;
        background-color: transparent;
        color: #ddd;
        cursor: pointer;
        outline: none;
        position: absolute;
        top: 0;
        right: 45px;
    }
    p {
        cursor: pointer;
        font-size: 18px;
        position: absolute;
        top: 0;
        right: 35px;
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
