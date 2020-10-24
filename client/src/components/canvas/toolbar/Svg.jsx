import React, { useRef } from 'react';
import Icon from '@mdi/react';
import {
    mdiSvg
} from '@mdi/js';

import { addSvg } from '../fabric-handlers/svg';
import { ToolbarButton } from '../styles';

const Svg = ({ getFabric, pushVersion }) => {
    const inputEl = useRef(null);

    function triggerUpload() {
        inputEl.current.click();
    }

    function upload({ target }) {
        const { files } = target;
        const exists = (files && files[0]);

        if (exists) {
            const isSvg = files[0].type.includes('svg');

            if (isSvg) {
                try {
                    const reader = new FileReader();
                    reader.onload = () => {
                        addSvg(reader.result, getFabric, pushVersion)
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

    return (
        <>
            <input
                ref={inputEl}
                type="file"
                placeholder="upload svg"
                onChange={upload}
                hidden
            />

            <ToolbarButton onClick={triggerUpload}>
                <Icon
                    path={mdiSvg}
                    title="upload svg"
                    size={1.2}
                />
            </ToolbarButton>
        </>
    );
}

export default Svg;
