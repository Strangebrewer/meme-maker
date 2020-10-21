import React, { useState } from 'react';
import Icon from '@mdi/react';
import {
    mdiUndo,
    mdiRedo,
} from '@mdi/js';

import { addSvg } from '../fabric-handlers/svg';
import { ToolbarButton } from '../styles';

const Svg = ({ getFabric, pushVersion }) => {
    function upload({ target }) {
        const { files } = target;
        const exists = (files && files[0]);

        if (exists) {
            const isSvg = files[0].type.includes('svg');

            if (isSvg) {
                try {
                    const reader = new FileReader();
                    reader.onload = () => addSvg(reader.result, getFabric, pushVersion);
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
        <input
            type="file"
            placeholder="upload svg"
            onChange={upload}
        />
    );
}

export default Svg;
