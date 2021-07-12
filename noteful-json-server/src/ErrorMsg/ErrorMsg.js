import React from 'react';
export default function ErrMsg(props) {
    return (
        <p className="input__errmessage">
            {props.validationMessage}
        </p>
    )
}