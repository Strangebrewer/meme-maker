import React, { useState, useEffect, useRef } from 'react';
import API from '../../api';

const UploadSvgButton = ({ setSvgs }) => {
    const svgInputEl = useRef(null);

    function triggerSvgInput() {
        svgInputEl.current.click();
    }

    async function uploadSVG({ target }) {
        const { files } = target;
        const exists = (files && files[0]);

        if (exists) {
            const name = files[0].name.split('.')[0];
            console.log('name:::', name)
            const isSvg = files[0].type.includes('svg');

            if (isSvg) {
                try {
                    const reader = new FileReader();
                    reader.onload = async () => {
                        const thisThing = reader.result.split('<svg');
                        const updateObject = {
                            name,
                            svg: '<svg' + thisThing[1]
                        }
                        const svg = await API.svg.create(updateObject);

                        setSvgs(svg.data);
                    };
                    reader.readAsText(files[0])
                } catch (e) {
                    window.alert('Iono what happend. Try again.');
                }
            } else {
                window.alert('You have to upload a propa svg file, stupid!');
            }
        }
    }

    const inputs = [
        { label: 'Name' }
    ];

    return (
        <>
            <input
                type="file"
                ref={svgInputEl}
                onChange={uploadSVG}
                hidden
            />

            <button onClick={triggerSvgInput}>upload svg</button>
        </>
    );
}

export default UploadSvgButton;
