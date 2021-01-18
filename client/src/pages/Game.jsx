import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Armor from '../components/game/armor';
import Warrior from '../components/game/characters/warrior';

const Game = props => {
    const [characters, setCharacters] = useState([]);

    function addWarrior() {
        const warrior = new Warrior({
            armor: 60 + Math.ceil(Math.random() * 40),
            race: 'Vulpera',
            vit: 1250,
            str: 14 + Math.ceil(Math.random() * 6),
            int: Math.ceil(Math.random() * 10),
            dex: 8 + Math.ceil(Math.random() * 6),
            name: 'Caerbannog'
        });

        const toons = [...characters];
        toons.push(warrior);
        setCharacters(toons);
    }

    function attack(char) {
        console.log('char in function attack:::', char);
        char.attack({
            damage: 85,
        });
    }

    function heal(char) {
        console.log('char in function heal:::', char);
        char.heal({
            health: 50
        });
    }

    function doTheThing(char) {
        const chest = new Armor({
            anatomy: 'chest',
            material: 'plate',
            name: 'Assholes Gonna Asshole',
            stats: {
                armor: 47,
                strength: 124,
                vitality: 152,
                haste: 85,
                verstility: 66
            }
        });

        char.equip(chest);
        char.unequip(chest);
    }

    return (
        <Page>
            Hello From the Gutter!
            <button onClick={addWarrior}>Warrior!</button>
            <FlexWrapper>
                {characters.length > 0 && characters.map((char, i) => {
                    return (
                        <Character key={i}>
                            <h2>{char.name}</h2>
                            <p>Race: {char.race}</p>
                            <p>Class: {char.type}</p>
                            <button onClick={() => attack(char)} className="action-btn attack-btn">attack!</button>
                            <button onClick={() => heal(char)} className="action-btn heal-btn">heal!</button>
                            <button onClick={() => doTheThing(char)}>do the thing!</button>
                        </Character>
                    )
                })}
            </FlexWrapper>
        </Page>
    )
}

export default Game;

const Page = styled.div`
    min-height: 100vh;
    background-color: #000;
    color: #ddd;
`;

const FlexWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 900px;
    margin: auto;
`;

const Character = styled.div`
    background-color: #a0a0a0;
    color: #2e2e2e;
    position: relative;
    padding: 20px;
    text-align: center;
    border: 4px solid red;
    border-radius: 15px;
    height: 200px;
    width: 200px;

    h2 {
        font-size: 22px;
    }

    .action-btn {
        border: 2px solid #fff;
        cursor: pointer;
        font-size: 10px;
        min-width: 50px;
        min-height: 20px;
        outline: transparent;
        border-radius: 4px;
        box-shadow: 2px 2px 2px #222;
        color: #fff;
        position: absolute;
        bottom: 20px;
    }

    .attack-btn {
        background-color: #720000;
        left: 20px;
    }

    .heal-btn {
        background-color: #096d00;
        right: 20px;
    }
`;
