import React from 'react';
import EditableTextarea from "./EditableTextarea";
import EditableText from "./EditableText";

class Notes extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
            isLoading: true,
            notes: '',
            title: '',
            content: '',
            msg: '',
            error: '',
            opened: false,
            creating: false,
        }   
        this.clickNote = this.clickNote.bind(this);
        this.clickAdd = this.clickAdd.bind(this);
        this.fetchNotes = this.fetchNotes.bind(this);
        this.addNote = this.addNote.bind(this);
    }
    
    componentDidMount(){
        this.fetchNotes();
    }

    clickNote() {
        const { opened } = this.state;
        this.setState({
            opened: !opened,
        });
    }

    fetchNotes(){
        fetch('/notes', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => this.setState({isLoading: false, notes: data}))
    }

    clickAdd() {
        const { creating } = this.state;
        this.setState({
          creating: !creating,
        });
    }

    addNote(title, content){
        this.setState({title: title, content: content, error: ''}, () => {
            const newNote = {
                title: this.state.title||'Untitled Note',
                content: this.state.content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            fetch('/notes', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote)
            })
            .then(response => response.json())
            .then(data => {
                newNote._id = data._id;
                const storedNotes = this.state.notes;
                storedNotes.unshift(newNote);
                this.setState({notes: storedNotes});
            })
            .catch(error => {
                this.setState({error: 'Error adding note.'});
                console.error('Error during adding note', error);
            })
        });
    }

	render() {
        const {notes} = this.state;
        let title;
        let content;
        return (
            <div>
                <div className="left-upper" onClick={this.clickNote}>
                    Note
                </div>
                {this.state.opened && 
                <div id="note-content" style={{backgroundColor: this.props.themeColor}}>
                    {this.state.isLoading && <div className="spinner">Loading...</div>}
                    {this.state.creating &&
                        <form>
                            <div className="note-container">
                                <button
                                    className="submit-button"
                                    type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (content.value){
                                            this.addNote(title.value, content.value);
                                            title.value = ''; content.value = '';
                                        }}}>
                                Create
                                </button>
                                <input className="input-style" type="text" placeholder="Title" ref={node => { title = node; }} required/><br/><br/>
                                <textarea rows="7" cols="40" type="text" placeholder="Content" ref={node => { content = node; }} required/><br/><br/>
                            </div>
                        </form>}
                {notes.length>0 && <div>{
                    notes.map((item,i) =>
                    <pre key={item._id}>
                        <div className="note-container border-left">
                        <div className="underline">
                        <EditableText
                            onChange={(e) => {
                                e.persist();
                                item.title = e.target.value;
                                fetch(`/notes/${item._id}`,{
                                    method: 'PUT',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(item), 
                                });
                                this.setState({notes});
                            }}
                        >{item.title}
                        </EditableText>
                        </div>
                        <div className="cursor-pointer right"
                            title="Delete"
                            onClick={() => {
                            fetch(`/notes/${item._id}`, {
                            method: 'DELETE',
                        })
                        notes.splice(i,1);
                        this.setState({notes, msg: `${item.content} will be deleted`});
                        }}>&times;</div>
                        <EditableTextarea
                            onChange={(e) => {
                                e.persist();
                                item.content = e.target.value;
                                fetch(`/notes/${item._id}`,{
                                    method: 'PUT',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(item), 
                                });
                                this.setState({notes});
                            }}
                        >{item.content}
                        </EditableTextarea>
                    </div></pre>)}</div>}
                {!this.state.isLoading && notes.length===0 && <div>No notes yet... Click + to get started.</div>}
                <div className="right-upper large-font" onClick={this.clickAdd}>+</div>
                {this.state.error && <div className="left-upper">{this.state.error}</div>}</div>}
            </div>
        )
	}
}

export default Notes;