import React from 'react';
import styled from 'styled-components';

import { horizontalWeatherWidget } from '../fabric-handlers/widgets/weather';
import { stockWidget } from '../fabric-handlers/widgets/stock';

import { SidebarSection } from '../styles';

const WidgetList = ({ getFabric, getScale, pushVersion, setDimensions }) => {
    function addWidget({ target }) {
        switch (target.value) {
            case 'calendar':
                break;
            case 'clock':
                break;
            case 'stock':
                stockWidget(getFabric, pushVersion);
                break;
            case 'weather':
                horizontalWeatherWidget(getFabric, pushVersion);
                break;
        }
    }

    return (
        <SidebarSection style={{ justifyContent: 'space-between' }}>
            <Button onClick={addWidget} value="calendar">Calendar</Button>
            <Button onClick={addWidget} value="clock">Clock</Button>
            <Button onClick={addWidget} value="stock">Stock Quote</Button>
            <Button onClick={addWidget} value="weather">Weather</Button>
        </SidebarSection>
    )
}

export default WidgetList;

const Button = styled.button`
    background: #BC13FE20;
    border: 2px solid ${props => props.theme.nRed};
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    margin: 10px 0;
    outline: transparent;
    padding: 8px 12px;
    width: 45%;
`;
