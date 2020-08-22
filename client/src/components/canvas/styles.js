import styled from 'styled-components';

export const ToolbarWrapper = styled.div`
    background-color: ${props => props.theme.bg};
    border: 2px solid ${props => props.theme.purple};
    border-radius: 30px;
    box-shadow: 0px 0px 5px ${props => props.theme.nBlue},
        inset 1px 1px 5px #fff,
        inset -1px -1px 5px #fff;
    display: flex;
    height: 60px;
    margin: 20px;
    margin-bottom: 0;
    padding: 0 20px;
    position: relative;
    width: calc(100% - 40px);
`;

export const ToolbarButton = styled.button`
    align-self: center;
    background: transparent;
    border: none;
    border-radius: 50%;
    color: ${props => props.disabled ? props.theme.iconDisabled : props.theme.icon};
    height: ${props => props.height ? props.height : '30'}px;
    margin: 0 2px;
    &:hover {
        cursor: pointer;
    }
`;

export const SidebarWrapper = styled.div`
    background-color: ${props => props.theme.bg};
    box-shadow: ${props => props.right ? '-5px 0 5px #000' : '5px 0 5px #000'};
    min-width: 260px;
    overflow-y: auto;
    min-height: calc(100vh - 92px);
    width: 260px;
`;

export const SidebarSection = styled.div`
    border-bottom: 1px solid #eee;
    color: ${props => props.theme.text};
    display: flex;
    flex-wrap: wrap;
    padding: 25px 20px;
    h4 {
        width: 100%;
        margin-bottom: 15px;
    }
`;

export const InputGroup = styled.div`
    margin: 0 5px;
    width: 40px;
    label {
        width: 100%;
    }
    input, select {
        background-color: transparent;
        border: none;
        border-bottom: 1px solid grey;
        color: ${props => props.theme.text};
        margin-top: 5px;
        width: 40px;
    }
    select{
        padding-top: 2px;
        width: 70px;
    }
    option {
        color: #000;
    }
`;