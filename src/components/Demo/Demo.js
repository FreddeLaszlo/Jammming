import React from 'react';
import './Demo.css';

// A react component to display 'DEMO'
function Demo({isDemo = true}) {
    if (!isDemo) {
        return false;
    }
    return <div className='demo'>
            DEMO
            <p>Click empty 'Search'<br></br>to see all items.</p>
        </div>;
}

export default Demo;