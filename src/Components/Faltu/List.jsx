import React from 'react';

const List = ({ items, clicked }) => { // Destructure props
    const handleClick = (id) => {
        clicked(id); // Call the clicked function passed via props
    };

    return (
        <div className="w-full px-0 md:w-1/2">
            <div className="space-y-2">
                {items.map((item, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleClick(item.track.id)}
                        className="w-full text-left py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded"
                    >
                        {item.track.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default List;
