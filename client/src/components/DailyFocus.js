import React from "react";

function getDate(){
  var d = new Date();
  d.setDate(d.getDate()); 
  return d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
}

class DailyFocus extends React.Component {
  constructor() {
    super();
    
    this.state = {
        focusObject: JSON.parse(localStorage.getItem('focus')) ||
        {
          _id: '',
          focus: '',
          completed: false,
          date: getDate()
        }
      };
      this.addFocus = this.addFocus.bind(this);
      this.handleComplete = this.handleComplete.bind(this);
      this.handleRemove = this.handleRemove.bind(this);
    }

    addFocus(text){
      let focusObject = Object.assign({}, this.state.focusObject);
      focusObject.focus = text;
      fetch('/focus', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(focusObject)
      })
      .then(response => response.json())
      .then(data => {
          focusObject._id = data._id;
          this.setState({focusObject});
          localStorage.setItem('focus', JSON.stringify(focusObject));
        })
    }
    
    handleComplete(){
      let focusObject = Object.assign({}, this.state.focusObject);
      focusObject.completed = !focusObject.completed;
      this.setState({focusObject});
      localStorage.setItem('focus', JSON.stringify(focusObject));
      fetch(`/focus/${focusObject._id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(focusObject)
      })
    }

    handleRemove(){
      let focusObject = Object.assign({}, this.state.focusObject);
      if (focusObject.completed === false){
        fetch(`/focus/${focusObject._id}`, {
          method: 'DELETE',
        })
      }
      focusObject.focus = '';
      focusObject.completed = false;
      this.setState({ focusObject });
      localStorage.setItem('focus', JSON.stringify(focusObject));
    }
    
    render() {

      // Ask for new focus for each day.
      let focusObject = Object.assign({}, this.state.focusObject);
      var focusStored = JSON.parse(localStorage.getItem('focus'))||[];
      if (focusStored.date !== getDate()){
        focusObject.focus = '';
        focusObject.completed = false;
        focusObject.date = getDate();
        this.setState({ focusObject });
        localStorage.setItem('focus', JSON.stringify(focusObject));
      }
      
      let focus;
      return (
        <div>
            {this.state.focusObject.focus === '' ? 
              <div className="create-focus center">
                What is your main focus for today? <br/>
                <form
                onSubmit={(e) => {
                  e.preventDefault();
                  this.addFocus(focus.value);
                  focus.value = '';
                }}>
                  <input
                  className="Input"
                  autoFocus={true}
                  ref={node => { focus = node; }}
                  required />
                </form>
              </div>
            : <div className="show-focus center">
            Today<br/>
            <input className="complete" type="checkbox" onClick={this.handleComplete} defaultChecked={this.state.focusObject.completed}/><div className={this.state.focusObject.completed ? "focus-striked" : "focus"}>{this.state.focusObject.focus}</div><div className="remove" onClick={this.handleRemove}>&times;</div>
            </div>}
        </div>
    );
  }
}
export default DailyFocus;