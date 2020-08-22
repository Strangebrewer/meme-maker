import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import API from '../api';

import Header from '../components/elements/Header';
import Modal from '../components/elements/Modal';

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

    const inputs = [
        { label: 'Name' }
    ];

    return (
        <div>
            <Modal
                show={show}
                close={closeModal}
                callback={newTemplate}
                items={inputs}
                handler={handleInputChange}
            />

            <Header page="content" logout={props.logout} />
            <Wrapper>
                <div style={{ width: '80px', height: '60px', borderRadius: '10px', margin: '10px', display: 'flex' }}>
                    <button style={{ margin: 'auto' }} onClick={() => setShow(true)}>WTF</button>
                </div>
                {templates && templates.map(item => {
                    return (
                        <Card key={item._id} onDoubleClick={() => openTemplate(item._id)}>
                            <h3>{item.name}</h3>
                        </Card>
                    )
                })}
            </Wrapper>
        </div>
    );
};

export default Content;

const Wrapper = styled.div`
    background-color: #eaeaea;
    min-height: calc(100vh - 92px);
    display: flex;
    flex: flex-wrap;
`;

const Card = styled.div`
    background-color: #fff;
    border: 1px solid purple;
    border-radius: 10px;
    box-shadow: 5px 5px 5px #666;
    height: 200px;
    margin: 10px;
    padding: 20px 30px;
    width: 300px;
    h3 {
        font-size: 24px;
        color: blue;
    }
`;
