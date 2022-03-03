import React, { useRef } from 'react';
import API from '../../api';

const UploadImageButton = ({ setImages }) => {
    const imgInputEl = useRef(null);

    function triggerImgInput() {
        imgInputEl.current.click();
    }

    async function uploadImage(event) {
        const { files } = event.target;
        if (!files[0].type.includes('image')) return;

        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'dragon-writer');

        if (process.env.REACT_APP_CLOUD_NAME) {
            const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload/`;
            const res = await fetch(url, {
                method: 'POST',
                body: data
            });
            const file = await res.json();

            const updateObject = {
                name: files[0].name.split('.')[0],
                image: file.secure_url,
                largeImage: file.eager[0].secure_url,
                midImage: file.eager[1].secure_url,
                thumbnail: file.eager[2].secure_url,
                publicId: file.public_id
            }
            const image = await API.image.create(updateObject);

            setImages(image.data);
        } else {
            window.alert('You must have a Cloudinary account to upload images. See the README.md file for details');
        }
    }

    return (
        <>
            <input
                type="file"
                ref={imgInputEl}
                onChange={uploadImage}
                hidden
            />

            <button onClick={triggerImgInput}>upload image</button>
        </>
    );
}

export default UploadImageButton;
