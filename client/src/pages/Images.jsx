import React, { useState, useEffect } from 'react';
import Header from '../components/elements/Header';
import Example from '../components/Example';
import API from '../api';

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

            {images && images.map((image, i) => {
                return <img key={i} src={image.thumbnail} style={{ margin: '15px' }} />
            })}
        </div>
    )
}

export default Images;
