import React from 'react';
import { render } from "react-dom";
import "./App.css";
import Greeting from "./components/Greeting";
import Settings from "./components/Settings";
import Initialization from "./Initialization"

class App extends React.Component {
  constructor() {
    super();
    
      this.state = {
        name: JSON.parse(localStorage.getItem('name')) || '',
        token: '',
      }
      this.logout = this.logout.bind(this);
}

componentDidMount(){
  if (localStorage.getItem('customization') !== null){
    var customStored = JSON.parse(localStorage.getItem('customization'));
    document.body.style.backgroundImage = `url(${customStored.bg})`;    
  }

  const obj = JSON.parse(localStorage.getItem('app'))|| '';
    if (obj && obj.token) {
      const { token } = obj;
      fetch('/verify?token=' + token)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            token,
          });
        }
      });
    }
}

logout(e){
  e.preventDefault();
  const obj = JSON.parse(localStorage.getItem('app'))|| '';
    if (obj && obj.token) {
      const { token } = obj;
      fetch('/logout?token=' + token)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json.success) {
          this.setState({
            token: ''
          });
          localStorage.setItem('app', JSON.stringify(""));
        }
      });
    }
}

render() {
  
  const { token } = this.state;

  if(token){
    return (
      <div>
        <Greeting name={this.state.name}/>
        <Settings logout={this.logout}/>
      </div>
  );
  } else {
    return (
      <Initialization/>
);}
}
}
render(<App />, document.getElementById("root"));

export default App;
