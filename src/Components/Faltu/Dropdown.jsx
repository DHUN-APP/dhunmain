import React from 'react';

const Dropdown = props => {    

    const dropdownChanged = e => {
        props.changed(e.target.value);
    }    

    return (
        <div className="flex flex-col sm:flex-row items-center mb-4">
            <label className="text-lg font-semibold text-gray-700 mr-4">{props.label}</label>       
            <select 
                value={props.selectedValue} 
                onChange={dropdownChanged} 
                className="form-select block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option key={0} value="">Select...</option>
                {props.options.map((item, idx) => (
                    <option key={idx + 1} value={item.id}>{item.name}</option>
                ))}
            </select>            
        </div>
    );
}

export default Dropdown;
