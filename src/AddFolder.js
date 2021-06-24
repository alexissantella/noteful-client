import React from 'react';
import NotefulContext from './NotefulContext';
import config from './config';
import PropTypes from 'prop-types';
import './NotefulForm/NotefulForm.css'

export default class AddFolder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        hasErrors: false,
        title: "",
        formValid: false,
        titleValid: false,
        validationMessage: "",
        };
    }

    static contextType = NotefulContext;
    
    goBack = () => {
        this.props.history.goBack();
    }

    updateFormEntry(e) {           
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        }, () => {this.validateEntry(name, value)});
    }

    validateEntry(name, value) {
        let inputErrors;
        let hasErrors = this.state.hasErrors;

        value = value.trim();
        if (value < 1) {
            inputErrors = `${name} is required.`;
        } 
        
        else {
            inputErrors = '';
            hasErrors = false;
        }
        this.setState({
            validationMessage: inputErrors,
            [`${name}Valid`]: !hasErrors,
            hasErrors: !hasErrors
        }, this.formValid );
    }

    formValid() {
        const { titleValid } = this.state;
        if (titleValid === true){
            this.setState({
                formValid: true
            });
        }
        else {this.setState({
            formValid: !this.formValid
            }
        )}
      }

    handleSubmit(e) {
        e.preventDefault();
        const { title } = this.state;
        const folder = {
            name: title
        }

        this.setState({error: null})
        fetch(`${config.foldersUrl}`, {
            method: 'POST',
            body: JSON.stringify(folder),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => {
                    console.log(`Error is: ${error}`)
                    throw error
                })
            }
            return res.json()
        })
        .then(data => {
            this.goBack()
            this.context.addFolder(data)
        })
        .catch(error => {
            this.setState({ error })
        })
    }

    render() {
        
        return (
            <form 
                className="Noteful-form"
                onSubmit={e => this.handleSubmit(e)}>
                <h2 className="title">Add Folder</h2>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input 
                    type="text" 
                    className="field"
                    name="title" 
                    id="title" 
                    aria-label="Title"
                    aria-required="true"
                    placeholder="Folder Title"
                    aria-placeholder="Folder Title"
                    onChange={e => this.updateFormEntry(e)}/>
                </div>
                <div className="buttons">
                 <button 
                    type="button" 
                    className="button"
                    onClick={() => this.goBack()}>
                     Cancel
                 </button>
                 <button 
                    type="submit" 
                    className="button"
                    // disabled={this.state.formValid === false}
                    >
                     Save
                 </button>
                 {}
                </div>
            </form> 
        )
    }
}


AddFolder.propType = {
    push: PropTypes.func.isRequired
};