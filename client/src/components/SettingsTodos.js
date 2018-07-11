import React from 'react';
  
class SettingsTodos extends React.Component {
  constructor() {
    super();

    this.state = {
      todos: {},
      isLoading: true,
      error: '',
    };

    this.clickAdd = this.clickAdd.bind(this);
  }

componentDidMount(){ 
    this.fetching = true;
    fetch('/todos', {
        method: 'get',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (this.fetching){
            this.setState({
                todos: data,
                isLoading: false
            })
        }
    })
    .catch(error => {
        this.setState({error: 'Error fetching todos. Please check your network connection.'});
        console.error('Error during fetch()', error);
    })
}

componentWillUnmount(){
    this.fetching = false;
}

clickAdd() {
    const { upload } = this.state;
    this.setState({
      upload: !upload,
    });
}

renderTab(){
    const { todos } = this.state;
    return todos.length === 0 ? <div className="middle container">You will see your past todos here.<br/>Can't find any history for this account.</div> :
    <div>
        {todos.map(item =>
        <div key={item._id}className="container container-style">
            <div className="active">{item.completed === true ? <div className="inline">✓</div> : <div className="inline">☓</div>} {item.todo}</div>
            <div className="right">{item.completed === true ? `from ${item.createdDate} to ${item.completedDate}` : 'not completed'}</div>
        </div>)}
    </div>
}

render() {
    const { isLoading } = this.state;
    return (
        <div>
            <div style={{fontSize: 20, marginBottom: 4}}>Todos</div>
            <div style={{fontSize: 12, color: '#999', marginBottom: 5}}>View your todos in the past</div>
            <div className="container">
            {(isLoading & !this.state.error) ? <div><div className="setting spinner"></div> <div className="loading">Loading...</div></div> : this.renderTab()} </div>
            <div className="error">{this.state.error}</div>
        </div>
    );
  }
}

export default SettingsTodos;