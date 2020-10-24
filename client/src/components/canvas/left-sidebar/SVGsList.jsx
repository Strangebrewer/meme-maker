import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiSelectSearch } from '@mdi/js';

import API from '../../../api';
import Modal from '../../elements/Modal';

import { addSvg } from '../fabric-handlers/svg';

import {
    addImage,
    setBackgroundImageConform,
    setBackgroundImageFill,
    setBackgroundImageFit,
    setBackgroundImageStretch,
} from '../fabric-handlers/image';

import { SidebarSection } from '../styles';

const SVGsList = ({ getFabric, getScale, pushVersion, setDimensions }) => {
    const [svgs, setSvgs] = useState(null);
    const [svgsCopy, setSvgsCopy] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchSVGs() {
            const results = await API.svg.get({ favorite: true });
            setSvgs(results.data);
        }
        fetchSVGs();
    }, []);

    function handleInputChange(e) {
        const { value } = e.target;
        setSearch(value);
    }

    async function find(e) {
        e.preventDefault();
        setSvgsCopy(svgs);
        const response = await API.svg.get({ normalizedName: search.toLowerCase() });
        setSvgs(response.data);
    }

    function clearSearch() {
        setSearch('');
        if (svgsCopy) setSvgs(svgsCopy);
    }

    async function doThisShit(svg) {
        console.log('svg in doThisShit:::', svg);
        addSvg(svg.svg, getFabric, pushVersion);
    }

    return (
        <SidebarSection>
            <Form onSubmit={find}>
                <input type="text" name="search" value={search} placeholder="search by name" onChange={handleInputChange} />
                <button onClick={find} title="go">
                    <Icon path={mdiSelectSearch} size={1.3} />
                </button>
                {search.length ? <p onClick={clearSearch} title="clear search">&times;</p> : null}
            </Form>
            
            {svgs && svgs.map((svg, i) => {
                return (
                    <Card key={i} onDoubleClick={() => doThisShit(svg)}>
                        <div dangerouslySetInnerHTML={{__html: svg.svg }}/>
                    </Card>
                )
            })}
        </SidebarSection>
    )
}

export default SVGsList;

export const Card = styled.div`
    display: flex;
    height: 110px;
    width: 110px;
    position: relative;
    background: linear-gradient(to bottom right, #BC13FE50, #fff, #4666FF70);
    margin: 5px;
    border: 1px solid ${props => props.theme.purple};

    div {
        height: 110px;
        width: 110px;
        align-self: center;
        margin: auto;
        
        svg {
            max-height: 100%;
            max-width: 100%;
        }
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
