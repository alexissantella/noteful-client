import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';
import Note from '../Note/Note'
import CircleButton from '../CircleButton/CircleButton'
import './NoteListMain.css'
import NotefulContext from '../NotefulContext'
import { getNotesForFolder } from '../notes-helpers'

export default class NoteListMain extends Component {
  static defaultProps = {
    match: {
      params: {}
    }
  }

  static contextType = NotefulContext;

  render() {
    const { folderId } = this.props.match.params
    const { notes=[] } = this.context
    const notesForFolder = getNotesForFolder(notes, folderId)
    return (
      <section className='NoteListMain'>
        <ul id="note__list">
          {notesForFolder.map(note => 
            <li key={note.id}>
              <Note
                id={note.id}
                name={note.name}
                modified={note.modified}
              />
              
            </li>
          )}
        </ul>
        <div className='NoteListMain__button-container'>
          <CircleButton
            tag={Link}
            to='/add-note'
            type='butto'
            className='NoteListMain__add-note-button'>
            <FontAwesomeIcon icon='plus' />
            <br />
            Note
          </CircleButton>
          
        </div>
      </section>
    )
  }

}


NoteListMain.propType = {
  match: PropTypes.object.isRequired
};