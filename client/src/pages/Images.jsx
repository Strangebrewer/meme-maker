import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/elements/Header';
import API from '../api';
import Icon from '@mdi/react';
import { mdiHeart, mdiHeartOutline  } from '@mdi/js';

 

const Images = props => {
    const [images, setImages] = useState(null);

    useEffect(() => {
        async function fetchImages() {
            const results = await API.image.get();
            setImages(results.data);
        }
        fetchImages();
    }, []);

    async function uploadImage(event) {
        const { files } = event.target;
        if (!files[0].type.includes('image')) return;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'dragon-writer');
        const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload/`
        const res = await fetch(url, {
            method: 'POST',
            body: data
        });
        const file = await res.json();
        const updateObject = {
            image: file.secure_url,
            largeImage: file.eager[0].secure_url,
            midImage: file.eager[1].secure_url,
            thumbnail: file.eager[2].secure_url,
            publicId: file.public_id,
            name: 'hell yes'
        }
        const image = await API.image.create(updateObject);
        setImages([...images, image.data]);
    }

    async function toggleFavorite(img) {
        console.log('img:::', img);
        const favorite = img.favorite ? false : true;
        const image = await API.image.edit({ ...img, favorite: !img.favorite });
        const results = await API.image.get();
        setImages(results.data);
    }

    return (
        <div>
            <Header page="Images" logout={props.logout} />

            <input
                type="file"
                id="file"
                name="file"
                onChange={uploadImage}
                placeholder="upload an image"
            />

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {images && images.map((image, i) => {
                    return (
                        <ImageContainer>
                            <Icon
                                size={1}
                                color={image.favorite ? 'red' : 'white'}
                                path={image.favorite ? mdiHeart : mdiHeartOutline}
                                onClick={() => toggleFavorite(image)}
                            />
                            <img key={i} src={image.midImage} />
                        </ImageContainer>
                    )
                })}
            </div>
        </div>
    )
}

export default Images;

export const ImageContainer = styled.div`
    display: flex;
    height: 250px;
    width: 250px;
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

    svg {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 99;
        cursor: pointer;
    }
`;

