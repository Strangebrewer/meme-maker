import React, { useEffect, useState } from 'react';
import { SidebarWrapper } from '../styles';
import Alignment from './Alignment';
import Border from './Border';
import Fill from './Fill';
import Font from './Font';
import Position from './Position';
import ScreenSize from './ScreenSize';
import Shadow from './Shadow';
import Size from './Size';

const Sidebar = (props) => {
    const { getFabric, getScale, selected, dimensions, setDimensions, pushVersion } = props;
    const [state, setState] = useState({
        screenSize: false,
        fill: false,
        shadow: false,
        border: false,
        font: false
    });

    useEffect(() => {
        // if (selected && selected.hasTag) {
        const itDoHasTag = selected && selected.hasTag;
        setState({
            screenSize: !selected,
            fill: itDoHasTag ? selected.hasTag('fill') : false,
            shadow: itDoHasTag ? selected.hasTag('shadow') : false,
            border: itDoHasTag ? selected.hasTag('border') : false,
            font: itDoHasTag ? selected.hasTag('font') : false
        });
        // }
    }, [selected]);

    return (
        <SidebarWrapper right>
            <Alignment
                getFabric={getFabric}
                selected={selected}
                getScale={getScale}
                pushVersion={pushVersion}
            />

            <Size
                getFabric={getFabric}
                selected={selected}
                getScale={getScale}
                pushVersion={pushVersion}
            />

            <Position
                getFabric={getFabric}
                selected={selected}
                pushVersion={pushVersion}
            />

            {state.screenSize &&
                <ScreenSize
                    selected={selected}
                    dimensions={dimensions}
                    setDimensions={setDimensions}
                />
            }

            {state.fill &&
                <Fill
                    getFabric={getFabric}
                    selected={selected}
                    pushVersion={pushVersion}
                />
            }
            
            {state.shadow &&
                <Shadow
                    getFabric={getFabric}
                    selected={selected}
                    pushVersion={pushVersion}
                />
            }

            {state.border &&
                <Border
                    getFabric={getFabric}
                    selected={selected}
                    pushVersion={pushVersion}
                />
            }

            {state.font &&
                <Font
                    getFabric={getFabric}
                    selected={selected}
                    pushVersion={pushVersion}
                />
            }
        </SidebarWrapper>
    )
}

export default Sidebar;