import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import styled from 'styled-components';
import API from '../../api';

import LeftSidebar from './left-sidebar/LeftSidebar';
import RightSidebar from './right-sidebar/RightSidebar';
import Toolbar from './toolbar/Toolbar';

import { registerEvents } from './fabric-handlers/helper';

import './fabric-objects/k-circle';
import './fabric-objects/k-group';
import './fabric-objects/k-image';
import './fabric-objects/k-path';
import './fabric-objects/k-rect';
import './fabric-objects/k-text';
import './fabric-objects/k-triangle';
import './fabric-objects/k-video';

const instance = {
    canvas: null,
    selected: null,
    scale: 1,
    versions: [],
    versionIndex: 0
}

const FabricCanvas = ({ templateId }) => {
    const [stateSelected, setStateSelected] = useState(null);
    const [current, setCurrent] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const canvas = new fabric.Canvas('canvas', {
            renderOnAddRemove: false,
            preserveObjectStacking: true,
            backgroundColor: '#222'
        });

        instance.canvas = canvas;

        registerEvents(getFabric, getSelected, setSelected, pushVersion, undo, redo);

        async function getTemplate() {
            const { data } = await API.content.getOne(templateId);
            setCurrent(data);
            const { backgroundColor, objects, width = 1920, height = 1080 } = data;
            const json = JSON.stringify({ backgroundColor, objects, width, height });
            getFabric().loadFromJSON(json, () => {
                calcZoom({ width, height });
                setScreenDimensions({ width, height });
                instance.versionIndex = 0;
                instance.versions = [JSON.stringify(getFabric())];
                getFabric().requestRenderAll();
            });
        }
        
        getTemplate();
    }, [templateId]);

    useEffect(() => {
        const { width, height } = dimensions;
        getFabric().setWidth(width);
        getFabric().setHeight(height);
        getFabric().requestRenderAll();
    }, [dimensions]);

    async function save() {
        const objects = getFabric().getObjects();
        const bg = getFabric().backgroundColor;
        const { width, height } = screenDimensions;

        const template = await API.content.edit({
            _id: templateId,
            backgroundColor: bg,
            name: current.name,
            height,
            width,
            objects
        });
        setCurrent(template);
    }

    function getFabric() {
        return instance.canvas;
    }

    function pushVersion() {
        console.log("Push Version Running muthafucka@")
        const version = JSON.stringify(instance.canvas);

        if (instance.versions.length > 9) {
            instance.versionIndex--;
            instance.versions.shift();
        }

        if (instance.versionIndex < instance.versions.length - 1) {
            instance.versions.splice(instance.versionIndex + 1);
        }

        instance.versionIndex++;
        instance.versions.push(version);
    }

    function undo() {
        instance.versionIndex--;
        if (instance.versionIndex < 0) {
            instance.versionIndex = 0;
            return;
        }
        const version = instance.versions[instance.versionIndex]
        getFabric().loadFromJSON(version, () => {
            getFabric().requestRenderAll();
        });
    }

    function redo() {
        instance.versionIndex++;
        if (instance.versionIndex > instance.versions.length - 1) {
            instance.versionIndex = instance.versions.length - 1;
            return;
        }
        const version = instance.versions[instance.versionIndex]
        getFabric().loadFromJSON(version, () => {
            getFabric().requestRenderAll();
        });
    }

    function getSelected() {
        return instance.selected;
    }

    const setSelected = ({ target: selected }) => {
        setStateSelected(selected);
        instance.selected = selected;
    }

    function getScale() {
        return instance.scale;
    }

    function setScale(dimensions) {
        const { width, height } = dimensions
        setScreenDimensions({ width, height });
        calcZoom(dimensions);
    }

    function calcZoom(dimensions) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const availableWidth = w - 700;
        const availableHeight = h - 232;
        let height = parseInt(dimensions.height);
        let width = parseInt(dimensions.width);
        let scale = 1;
        let heightDiff = 0;
        let widthDiff = 0;

        function round(num, places) {
            const x = Math.pow(10, places);
            return Math.round(num * x) / x;
        }

        if (availableWidth < width)
            widthDiff = width - availableWidth;

        if (availableHeight < height)
            heightDiff = height - availableHeight;

        if (heightDiff > widthDiff) {
            if (height > availableHeight) {
                scale = round((availableHeight / height), 2);
                height = height * scale;
                width = width * scale;
            }
        } else {
            if (width > availableWidth) {
                scale = round((availableWidth / width), 2);
                height = height * scale;
                width = width * scale;
            }
        }
        
        setDimensions({ width, height });
        if (dimensions.reset) getFabric().discardActiveObject().setViewportTransform([1,0,0,1,0,0]);
        instance.scale = scale;
        getFabric().setZoom(scale);
    }

    return (
        <CanvasPage>
            <LeftSidebar getFabric={getFabric} setDimensions={setScale} dimensions={screenDimensions} />
            <div style={{ width: '100%' }}>
                <Toolbar
                    getFabric={getFabric}
                    save={save}
                    selected={stateSelected}
                    pushVersion={pushVersion}
                    undo={undo}
                    redo={redo}
                />
                <CanvasWrapper width={dimensions.width} height={dimensions.height}>
                    <canvas id="canvas"></canvas>
                </CanvasWrapper>
            </div>
            <RightSidebar
                getFabric={getFabric}
                selected={stateSelected}
                setDimensions={setScale}
                dimensions={screenDimensions}
                getScale={getScale}
                pushVersion={pushVersion}
            />
        </CanvasPage>
    )
};

export default FabricCanvas;

const CanvasPage = styled.div`
    display: flex;
    position: relative;
    justify-content: space-between;
    min-height: calc(100vh - 92px);
`;

const CanvasWrapper = styled.div`
    box-shadow: 5px 5px 5px #000;
    height: ${props => props.height}px;
    margin: 60px auto;
    width: ${props => props.width}px;
`;
