import React from 'react';
  
class SettingsFocus extends React.Component {
  constructor() {
    super();

    this.state = {
      focus: {},
      isLoading: true,
      error: '',
    };

    this.clickAdd = this.clickAdd.bind(this);
  }

componentDidMount(){ 
    this.fetching = true;
    fetch('/focus', {
        method: 'get',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (this.fetching){
            this.setState({
                focus: data,
                isLoading: false
            });
        }
    })
    .catch(error => {
        this.setState({error: 'Error fetching focus. Please check your network connection.'});
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
    const { focus } = this.state;
    return focus.length === 0 ? <div className="middle container">You will see your past focus here.<br/>
    Can't find any history for this account.</div> :
    <div>
        {focus.map(item =>
        <div key={item._id} className="container container-style">
            {item.date.replace(/-0+/g, '-').slice(5)}: <div className="active">{item.focus}</div>
            <div className="right">{item.completed === true ? 'completed' : 'not completed'}</div>
        </div>)}
    </div>
}

render() {
    const { isLoading } = this.state;
    return (
        <div>
            <div style={{fontSize: 20, marginBottom: 4}}>Focus</div>
            <div style={{fontSize: 12, color: '#999', marginBottom: 5}}>View your focus in the past</div>
            <div className="container">
            {(isLoading & !this.state.error) ? <div><div className="setting spinner"></div> <div className="loading">Loading...</div></div> : this.renderTab()} </div>
            <div className="error">{this.state.error}</div>
        </div>
    );
  }
}

export default SettingsFocus;