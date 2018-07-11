import React from "react";

function checkTime(){
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  if (m < 10) {
    m = "0" + m;
  }
  return h+":"+m;
}

class Greeting extends React.Component {
  constructor() {
    super();
    
    this.state = { currentTime: checkTime() };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      currentTime: checkTime()
    });
  }

  render() {
    
    var { name } = this.props;
    var today = new Date();
    var currentHour = today.getHours();
    let greeting = null;
    if (currentHour < 12) {
    greeting = (<div>Good morning, {name}.</div>);
    } else if (currentHour < 18) {
    greeting = (<div>Good afternoon, {name}.</div>);
     } else {
    greeting = (<div>Good evening, {name}.</div>);
    }

    return (
      <div>
        <div className="time center">{this.state.currentTime}</div>
        <div className="greet center">{greeting}</div>
      </div>
    );
  }
}

export default Greeting;