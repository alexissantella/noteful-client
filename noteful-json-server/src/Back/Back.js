import React from 'react';
import PropTypes from 'prop-types';
import NotefulContext from '../NotefulContext';
import './Back.css'

class Back extends React.Component {
    
    static contextType = NotefulContext;


    render() {
        return (
            <button 
                className="back_btn" 
                onClick={this.context.back}>
                    Back
            </button>
        )
    }    
}
    

export default Back

Back.propTypes = {
    goBack: PropTypes.func
}