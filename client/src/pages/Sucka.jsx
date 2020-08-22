import React, { useState, useEffect } from 'react';
import Header from '../components/elements/Header';
import Example from '../components/Example';

const Sucka = props => {
    const [count, setCount] = useState(0);
    const updateCount = () => setCount(count + 1);

    return (
        <div>
            <Header page="sucka" logout={props.logout} />
            <button onClick={updateCount}>{count}</button>
            {count < 5 && <Example count={count} />}
            {count < 5 && <Example count={-1} />}
        </div>
    )
}

export default Sucka;
