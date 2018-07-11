import React from 'react';

class Initialization extends React.Component {
  constructor() {
    super();
    
    this.state = {
        name: JSON.parse(localStorage.getItem('name')) || '',
        msg: '',
      };
    
    this.handleChange = this.handleChange.bind(this);
    this.addName = this.addName.bind(this);
    this.addEmail = this.addEmail.bind(this);
    this.signin = this.signin.bind(this);
    this.signup = this.signup.bind(this);
}

handleChange(e) {
  this.setState({[e.target.name]: e.target.value}); 
}

addName(text){
  this.setState({ name: text });
  localStorage.setItem('name', JSON.stringify(text));
}

addEmail(text){
  this.setState({ email: text });
  localStorage.setItem('email', JSON.stringify(text));
}

signin(e){
  e.preventDefault();
  fetch('/signin', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
    })
  })
  .then(response => response.json())
  .then(data => {console.log(data);
      localStorage.setItem('app', JSON.stringify({token: data.token}));
      this.setState({token: data.token, msg: data.message})
      if (data.success){
          window.location.reload();
      }
  })
  .catch(error => {
      this.setState({msg: 'Error logging in.'});
      console.error('Error during authentication', error);
  })
}

signup(e) {
  e.preventDefault();
  fetch("/signup", {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
      })
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);
      this.setState({msg: data.message});
  })
  .catch(err => console.log(err));
}

render() {
    let input;
    return (
      <div>
          {this.state.name === '' ?
            <div className="animate-top center">
              Hello, what's your name?<br/>
              <form onSubmit={(e) => {
                e.preventDefault();
                this.addName(input.value);
              }}>
                <input
                  className="Input padding-top"
                  ref={node => { input = node; }}
                  required />
              </form>
            </div>
              :
             ( !this.state.email ?
            <div className="animate-top center">
              What's your email, {this.state.name}?<br/>
              <form onSubmit={(e) => {
                    e.preventDefault();
                    this.addEmail(input.value);
              }}>
                <input
                  type="email"
                  className="Input padding-top"
                  ref={node => { input = node; }}
                  required />
              </form>
            </div>
              :
            <div>
              <div className="animate-top center padding-top">
              What's your password?<br/>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="password"
                  className="Input padding-top"
                  onChange={this.handleChange}
                  name="password"
                  required />
              </form>
              <div className="auth-button inline" onClick={this.signin}>Log in</div>               <div className="auth-button inline" onClick={this.signup}>Sign up</div>
              </div>
              <div className="bottom center inline">{this.state.msg}</div>
            </div>)}
      </div>
  );
}
}

export default Initialization;
