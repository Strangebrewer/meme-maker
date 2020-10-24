import React, { useState } from 'react';
import ImagesList from './ImagesList';
import SVGsList from './SVGsList';
import styled from 'styled-components';

import { SidebarWrapper } from '../styles';

const Sidebar = ({ getFabric, getScale, pushVersion, selected, setDimensions }) => {
    const [list, setList] = useState('images');

    function hasTag(tag) {
        return selected && ((selected.hasTag && selected.hasTag(tag)) || selected.type === 'group');
    }

    function toggleList(event) {
        const { value } = event.target;
        if (value === list) return;
        setList(value);
    }

    return (
        <SidebarWrapper left>
            <div>
                <Button
                    first
                    value="images"
                    onClick={toggleList}
                    hightlight={list === 'images'}
                >
                    Images
                </Button>

                <Button
                    value="svgs"
                    onClick={toggleList}
                    hightlight={list === 'svgs'}
                >
                    SVGs
                </Button>
            </div>

            {list === 'images' && (
                <ImagesList
                    getFabric={getFabric}
                    getScale={getScale}
                    pushVersion={pushVersion}
                    setDimensions={setDimensions}
                />
            )}

            {list === 'svgs' && (
                <SVGsList
                    getFabric={getFabric}
                    getScale={getScale}
                    pushVersion={pushVersion}
                    setDimensions={setDimensions}
                />
            )}
        </SidebarWrapper>
    )
}

export default Sidebar;

const Button = styled.button`
    background: ${props => props.hightlight ? '#BC13FE20' : 'transparent'};
    color: white;
    width: 50%;
    height: 40px;
    border: none;
    border-bottom: 1px solid grey;
    border-right: ${props => props.first ? '1px solid grey' : 'none'};
    outline: none;
`;