import React from 'react';
import NotefulContext from './NotefulContext';
import config from './config';
import './NotefulForm/NotefulForm.css';

export default class AddNote extends React.Component {
    state = {
        title: "",
        content: "",
        folderSelect: "",
        folderId: "",
        formValid: false,
        titleValid: false,
        contentValid: false,
        folderSelectValid: false,
        validationMessage: null
    };

    static contextType = NotefulContext;

    goBack = () => {
        this.props.history.goBack();
    }

    updateFormEntry(e) {       
        const name = e.target.name;
        const value = e.target.value;
        let id;
 
        if (e.target.selectedOptions) {
            id = e.target.selectedOptions[0].id;
            this.setState({
                'folderId': id 
            })
        }
        this.setState({
            [e.target.name]: e.target.value,
            
        }, () => {this.validateEntry(name, value)});
    }

    // validateEntry(name, value) {
    //     let hasErrors = false;

    //     value = value.trim();
    //     if((name === 'title') || (name === 'content')) {
    //         if (value.length < 1) {
    //             hasErrors = true
    //         } 

    //         else {
    //             hasErrors = false
    //         }
    //     }
        
    //     else if((name === 'folderSelect') && (value === 'Select')) {
    //         hasErrors = true
    //     }
        
    //     else {
    //         hasErrors = false
    //     }
        
    //     this.setState({
    //         [`${name}Valid`]: !hasErrors,
    //     }, this.formValid );
    // }

    validateEntry(name, value) {
        let inputErrors;

        value = value.trim();
        if (value < 1) {
            inputErrors = `${name} is required.`;
            this.setState({
                validationMessage: inputErrors,
                [`${name}Valid`]: false,
                hasErrors: true
            }, this.formValid );
        } else {
            inputErrors = '';
            this.setState({
                validationMessage: inputErrors,
                [`${name}Valid`]: true,
                hasErrors: false
            }, this.formValid );
        }
    }

    formValid() {
        const { titleValid, contentValid, folderSelectValid } = this.state;
        if (titleValid && contentValid && folderSelectValid === true){
            this.setState({
                formValid: true,
                validationMessage: null
            });
        }
        else {this.setState({
            formValid: !this.formValid,
            validationMessage: 'All fields are required.'
        })}
      }

    handleSubmit(e) {
        e.preventDefault();
        let { title } = this.state;
        //  let { title, content, folderId } = this.state;
        // need to validate the title before we submit
        this.validateEntry('title', title);
        if (!title || title.length === 0) {
            return;
        }

        // if we get here, then we have a good title

        const { content, folderId } = this.state;
        const note = {
            name: title,
            content: content,
            folderid: folderId,
            modified: new Date()
        }

        this.setState({error: null})

        
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            body: JSON.stringify(note),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    console.log(`Error is: ${err}`)
                    throw err
                })
            }
            return res.json()
        })
        .then(data => {
            this.goBack()
            this.context.addNote(data)
        })
        .catch(err => {
            this.setState({ err })
        })
    }

    
    render() {
        const folders = this.context.folders;
        const options = folders.map((folder) => {
            return(
            <option 
                key ={folder.id} 
                id={folder.id}>
                {folder.name}
            </option>
            )
        })
        
        return (
            <form 
                className="Noteful-form"
                onSubmit={e => this.handleSubmit(e)}>
                <h2 className="title">Add Note</h2>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input 
                    type="text" 
                    className="field"
                    name="title" 
                    id="title" 
                    aria-label="Title"
                    aria-required="true"
                    placeholder="Note Title"
                    onChange={e => this.updateFormEntry(e)}/>
                </div>
                <div className="form-group">
                   <label htmlFor="content">Note:</label>
                   <textarea 
                        className="field"
                        name="content" 
                        id="content"
                        aria-label="Note:"
                        aria-required="false"
                        onChange={e => this.updateFormEntry(e)}/>
                </div>
                <div className="form-group">
                  <label htmlFor="folder-select">folder</label>
                  <select 
                    type="text" 
                    className="field"
                    name="folderSelect" 
                    id="folder-select" 
                    aria-label="folder"
                    aria-required="true"
                    ref={this.folderSelect}
                    onChange={e => this.updateFormEntry(e)}>
                        <option>Select</option>
                        { options }
                    </select>
                </div>
                <div className="buttons">
                 <button 
                    type="button" 
                    className="button"
                    onClick={()=> this.goBack()}>
                     Cancel
                 </button>
                 <button 
                    type="submit" 
                    className="button"
                    disabled={!this.state.formValid}>
                     Save
                 </button>
                 {this.state.titleValid === false &&
                    <span>{this.state.validationMessage}</span>
                 }
                </div>
            </form> 
        )
    }
}