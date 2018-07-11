import React from "react";
import EditableText from "./EditableText";

const InputTodo = ({addTodo}) => {
  let input;
  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        addTodo(input.value);
        input.value = '';
      }}>
      <input
        className="add-todo"
        placeholder='New todo'
        ref={node => { input = node; }}
        required />
    </form>
  );
};

class Todo extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
        todoArray: [],
        isLoading: true,
        isUploading: false,
        error: '',
        opened: false
      };

    this.clickTodo = this.clickTodo.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.fetchTodos = this.fetchTodos.bind(this);
  }

  clickTodo() {
    const { opened } = this.state;
    this.setState({
      opened: !opened,
    });
  }

  componentDidMount(){
    this.fetchTodos();
  }

  fetchTodos(){
    fetch('/todos', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => this.setState({isLoading: false, todoArray: data.filter(item => item.completed === false)}))
    .catch(error => {
      this.setState({error: 'Error fetching todos. Please check your network connection.'});
      console.error('Error during fetch()', error);
    })
  }

  addTodo(text){
    this.setState({isUploading: true})
    const storedTodo = this.state.todoArray;
    let todoArray = {};
    todoArray.todo = text;
    todoArray.createdDate = new Date().toLocaleDateString("en-us", {month:"short"}) + ' ' + new Date().getDate();
    todoArray.completedDate = null;
    todoArray.completed = false;
    fetch('/todos', {
      method: 'POST',
      credentials: 'include',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoArray)
    }).then(response => response.json())
    .then(data => {
        todoArray._id = data._id;
        storedTodo.push(todoArray);
        this.setState({ todoArray: storedTodo, isUploading: false });
      })
  }

  handleComplete(key){
    const { todoArray } = this.state;
    todoArray[key].completed = !todoArray[key].completed;
    todoArray[key].completedDate = new Date().toLocaleDateString("en-us", {month:"short"}) + ' ' + new Date().getDate();
    this.setState({ todoArray });
    fetch(`/todos/${todoArray[key]._id}`, {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoArray[key])
    })
  }

  handleRemove(key){
    const { todoArray } = this.state;
    if (todoArray[key].completed === false){
      fetch(`/todos/${todoArray[key]._id}`, {
        method: 'DELETE',
      })
    }
    const remainder = todoArray.filter(item => item !== todoArray[key]);
    this.setState({ todoArray: remainder });
  }
  
  render() {
    const { todoArray } = this.state;
    return (
      <div >
        <div className="todo" onClick={this.clickTodo}>
          Todo
        </div>
        {this.state.opened && (
          <div id="todo-content" style={{backgroundColor: this.props.themeColor}}>
          {todoArray.length > 0 ? todoArray.filter(item => item.completed === false).length : "0"} to do
          {this.state.isUploading && <div className="right">Adding...</div>}
          {this.state.isLoading && <div><div className="spinner todo-spinner"></div><div className="todo-loading">Loading...</div></div>}
          {this.state.error && <div className="todo-loading">{this.state.error}</div>}
          {!this.state.isLoading && todoArray.length === 0
            && <div className="middle">
            <div style={{fontSize: 70}}>☺</div>
            Add a new todo to get started.
            </div>}
          <br/>
          {!this.state.isLoading && todoArray.length > 0 && todoArray.map((item, key) => 
          <div className={item.completed ? "inline line-through" : "inline"} key={item._id}>
          <input type="checkbox" onClick={this.handleComplete.bind(this,key)} defaultChecked={item.completed}/>
          <EditableText
            onChange={(e) => {
              e.persist();
              item.todo = e.target.value;
              fetch(`/todos/${item._id}`,{
                  method: 'PUT',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(item), 
              });
              this.setState({todoArray});
            }}
          >{item.todo}</EditableText>
          <div className="right" title="Delete" onClick={this.handleRemove.bind(this,key)}>&times;</div><br/></div>
          )}
          <InputTodo addTodo={this.addTodo}/>
          </div>
        )}
      </div>
    );
  }
}

export default Todo;