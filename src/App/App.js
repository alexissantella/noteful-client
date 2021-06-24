import React from "react";
import { Route, Link } from "react-router-dom";
import NotefulContext from "../NotefulContext";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import AddFolder from "../AddFolder";
import AddNote from "../AddNote";
import ErrorBoundary from "../Errors/ErrorBoundary";
import "./App.css";
import config from '../config'

const API = config.API_ENDPOINT;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      folders: [],
      errorBoundaryKey: 0
    };
  }

  handleBackButton = () => {
    this.setState(
      prevState => ({
        errorBoundaryKey: prevState.errorBoundaryKey + 1
      }),
      console.clear()
    );
  };

  handleAddFolder = folder => {
    this.setState({
      folders: [...this.state.folders, folder]
    });
  };

  handleAddNote = note => {
    this.setState({
      notes: [...this.state.notes, note]
    });
  };

  componentDidMount() {
    Promise.all([
      fetch(`${API}/notes`), 
      fetch(`${API}/folders`
      )])
      .then(([notesRes, foldersRes]) => {
        if (!notesRes.ok) return notesRes.json().then(e => Promise.reject(e));
        if (!foldersRes.ok)
          return foldersRes.json().then(e => Promise.reject(e));
        return Promise.all([notesRes.json(), foldersRes.json()]);
      })
      .then(([notes, folders]) => {
        folders.map(folder => {
          return this.handleAddFolder(folder);
        });
        notes.map(note => {
          return this.handleAddNote(note);
        });
      })
      .catch(error => {
        console.error({ error });
      });
  }

  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    });
  };

  handleDeleteFolder = folderId => {
    this.setState({
      folders: this.state.folders.filter(folder => folder.id !== folderId)
    });
  };

  renderNavRoutes() {
    return (
      <>
        {["/", "/folder/:folderId"].map(path => (
          <Route exact key={path} path={path} component={NoteListNav} />
        ))}
        <Route path="/note/:noteId" component={NotePageNav} />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {["/", "/folder/:folderId"].map(path => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <ErrorBoundary key={this.state.errorBoundaryKey}>
          <Route path="/note/:noteId" component={NotePageMain} />
        </ErrorBoundary>
        <Route path="/add-folder" component={AddFolder} />
        <Route path="/add-note" component={AddNote} />
      </>
    );
  }

  render() {
    const contextValue = {
      notes: this.state.notes,
      folders: this.state.folders,
      toggle: this.state.toggle,
      toggleErrors: this.handleErrorToggle,
      addNote: this.handleAddNote,
      addFolder: this.handleAddFolder,
      deleteNote: this.handleDeleteNote,
      deleteFolder: this.handleDeleteFolder,
      back: this.handleBackButton
    };

    return (
      <NotefulContext.Provider value={contextValue}>
        <div className="App">
          <nav className="App__nav">{this.renderNavRoutes()}</nav>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>
            </h1>
          </header>
          <main className="App__main">{this.renderMainRoutes()}</main>
        </div>
      </NotefulContext.Provider>
    );
  }
}

export default App;