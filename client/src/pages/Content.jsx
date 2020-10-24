import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import API from '../api';
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';

import Header from '../components/elements/Header';
import Modal from '../components/elements/Modal';

import { PageWrapper } from './styles'; 

const Content = props => {
    const history = useHistory();
    const [templates, setTemplates] = useState(null);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState(null);

    useEffect(() => {
        async function fetchTemplates() {
            const results = await API.content.get();
            setTemplates(results.data);
        }
        fetchTemplates();
    }, []);

    function closeModal() {
        setShow(false);
        setForm(null);
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        const update = {
            ...form,
            [name]: value
        }
        setForm(update);
    }

    async function newTemplate() {
        const { data } = await API.content.create(form);
        openTemplate(data._id);
    }

    function openTemplate(id) {
        history.push(`/canvas/${id}`);
    }

    async function deleteTemplate(item) {
        await API.content.destroy(item._id);
        const results = await API.content.get();
        setTemplates(results.data);
    }

    const inputs = [
        { label: 'Name' }
    ];

    return (
        <PageWrapper>
            <Modal
                show={show}
                close={closeModal}
                callback={newTemplate}
                items={inputs}
                handler={handleInputChange}
            />

            <Header page="content" logout={props.logout} />
            <Wrapper>
                <button onClick={() => setShow(true)}>New Canvas</button>

                <div>
                    {templates && templates.map(item => {
                        return (
                            <Card key={item._id} onDoubleClick={() => openTemplate(item._id)}>
                                <h3>{item.name}</h3>
                                <div>
                                    <img src={item.thumbnail} crossOrigin="true" />
                                </div>
                                <Icon
                                    size={1}
                                    className="delete-icon"
                                    color="#DF002D"
                                    path={mdiTrashCanOutline}
                                    onClick={() => deleteTemplate(item)}
                                />
                            </Card>
                        )
                    })}
                </div>
            </Wrapper>
        </PageWrapper>
    );
};

export default Content;

const Wrapper = styled.div`
    text-align: center;

    > button {
        background-color: white;
        border: 2px solid ${props => props.theme.nRed};
        border-radius: 5px;
        box-shadow: 5px 5px 5px #222,
            inset 1px 1px 5px ${props => props.theme.blue},
            inset -1px -1px 5px ${props => props.theme.blue};
        color: ${props => props.theme.purple};
        cursor: pointer;
        height: 40px;
        outline: none;
        width: 120px;
        margin: 15px 0;
    }

    > div {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 1300px;
        margin: auto;
    }
`;

const Card = styled.div`
    background: linear-gradient(to bottom right,
        #000,
        #4666FF,
        #4666FF55,
        #fff,
        #fff,
        #BC13FE55,
        #BC13FE,
        #fff
    );
    border-bottom: 2px solid ${props => props.theme.white};
    border-right: 2px solid ${props => props.theme.white};
    border-top: 2px solid ${props => props.theme.black};
    border-left: 2px solid ${props => props.theme.black};
    border-radius: 10px;
    border-bottom-left-radius: 15px;
    border-top-right-radius: 12px;
    box-shadow: inset 5px 5px 5px #333;
    height: 240px;
    margin: 10px;
    position: relative;
    width: 240px;

    h3 {
        font-size: 24px;
        color: blue;
        margin: 10px 0;
        text-align: center;
        text-shadow:0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 8px 8px 5px #111;
    }

    div {
        width: 160px;
        height: 160px;
        margin: 0 auto;
        display: flex;
        background-color: #00000011;
        /* border: 2px solid ${props => props.theme.black}; */
        box-shadow: 10px 10px 10px #333;
        
        img {
            max-width: 100%;
            max-height: 100%;
            align-self: center;
            margin: auto;
        }
    }

    .delete-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 99;
        cursor: pointer;
        text-shadow: 5px 5px 5px #111;
    }
`;
