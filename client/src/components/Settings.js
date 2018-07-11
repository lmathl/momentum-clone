import React from "react";
import settings from "../settings_white.png";
import WeatherFetch from "./WeatherFetch";
import DailyFocus from "./DailyFocus";
import DailyQuote from './DailyQuote';
import Todo from "./Todo";
import Note from "./Note";
import SettingsPhotos from "./SettingsPhotos";
import SettingsQuotes from "./SettingsQuotes";
import SettingsFocus from "./SettingsFocus";
import SettingsTodos from "./SettingsTodos";

class Settings extends React.Component {
  constructor(props) {
    super(props);

    if (localStorage.getItem('customization') !== null) {
      var customStored = JSON.parse(localStorage.getItem('customization'));
      var fontStored = customStored.font;
      document.body.style.fontFamily = fontStored;
      this.state = {...customStored, index: 0, updateQuote: "",};
    } else {
      this.state = {
        opened: false,
        weatherVisible: true,
        todoVisible: true,
        quoteVisible: true,
        focusVisible: true,
        noteVisible: true,
        displayname: "kuma",
        themeColor: "black",
        font: "Arial",
        bg: "/static/media/bg1.af3a8ef5.jpg",
        index: 0,
        updateQuote: "",
      }

      var customization = { opened: false,
        weatherVisible: true,
        todoVisible: true,
        quoteVisible: true,
        focusVisible: true,
        noteVisible: true,
        displayname: "kuma",
        font: "Arial",
        themeColor: "black",
        bg: "/static/media/bg1.af3a8ef5.jpg"
      };
      localStorage.setItem("customization", JSON.stringify(customization));
    }  
  ; 
    this.clickSettings = this.clickSettings.bind(this);
  }
  
  clickSettings() {
    const { opened } = this.state;
    this.setState({
      opened: !opened,
    });
  }

  showSetting(i){
    this.setState({ index: i })
  }

  changeFont(font){
    document.body.style.fontFamily = font;
    var customStored = JSON.parse(localStorage.getItem('customization'));
    customStored.font = font;
    localStorage.setItem("customization", JSON.stringify(customStored));
  }

  changeTheme(color){
    document.getElementById("settings-content").style.backgroundColor = color;
    this.setState({themeColor: color});
    var customStored = JSON.parse(localStorage.getItem('customization'));
    customStored.themeColor = color;
    localStorage.setItem("customization", JSON.stringify(customStored));
  }

  showHideComponents(){
    const visible = ['weatherVisible', 'todoVisible', 'quoteVisible', 'focusVisible', 'noteVisible'];
    const items = ['Weather', 'Todo', 'Quote', 'Focus', 'Note'];
    return visible.map( (item,index) =>
        <div key={index} className="container container-style cursor-pointer user-select-none"
          onClick={ () => {
            this.setState({[visible[index]]: !this.state[visible[index]]});
            var custom = JSON.parse(localStorage.getItem("customization"));
            custom[item] = !this.state[visible[index]];
            localStorage.setItem("customization", JSON.stringify(custom));
        }}>
          <div className="left">{items[index]}</div>
          <input
            type="checkbox"
            className="right"
            checked={this.state[visible[index]]}
            onChange={()=>{}}/>
        </div>
    );
  }

  handleQuoteUpdate = (newQuote) => {
    this.setState({
      updateQuote: newQuote
    })
  }

  renderSetting(){
    switch(this.state.index){
      case 1:
      return <SettingsFocus/>
      case 2:
      return <SettingsTodos/>
      case 3:
      return <SettingsPhotos/>
      case 4:
      return <SettingsQuotes quoteUpdate={this.handleQuoteUpdate}/>
      default:
      return (
        <div>
          <div style={{fontSize: 20, marginBottom: 4}}>General</div>
          <div style={{fontSize: 12, color: '#999', marginBottom: 20}}>Customize your dashboard</div>
          <div style={{fontSize: 13, marginBottom: 8}}>SHOW</div>
          {this.showHideComponents()}
          <br/>
          <br/>
          <div style={{fontSize: 13, marginBottom: 8}}>CUSTOMIZE</div>
          <div className="container container-style">
            <div className="left">Theme</div>
            <div className="right-options" onClick={() => this.changeTheme("#007777")}>Blue green</div>
            <div className="right-options" onClick={() => this.changeTheme("#565655")}>Grey</div>
            <div className="right-options" onClick={() => this.changeTheme("#007729")}>Green</div>
            <div className="right-options" onClick={() => this.changeTheme("#4d0656")}>Purple</div>
            <div className="right-options" onClick={() => this.changeTheme("#0e254c")}>Navy Blue</div>
            <div className="right-options" onClick={() => this.changeTheme("black")}>Black</div>
          </div>
          <div className="container container-style">
            <div className="left">Font</div>
            <div className="right-options" onClick={() => this.changeFont('Calibri')}>Calibri</div>
            <div className="right-options" onClick={() => this.changeFont('Times New Roman')}>Times New Roman</div>
            <div className="right-options" onClick={() => this.changeFont('Century Gothic')}>Century Gothic</div>
            <div className="right-options" onClick={() => this.changeFont('Trebuchet MS')}>Trebuchet MS</div>
            <div className="right-options" onClick={() => this.changeFont('Arial')}>Arial</div>
          </div>
        </div>
      )
      }
  }

    render() {
    const { opened } = this.state;
    const settingOptions = ['General', 'Focus', 'Todos', 'Photos', 'Quotes'];
    var { updateQuote } = this.state;
    const email = JSON.parse(localStorage.getItem('email'))||"";
    return (
      <div>
        <div onClick={this.clickSettings}>
          <img src={settings} className="settings" alt="Settings"/>
        </div>
        {opened && (
          <div id="settings-content" style={{backgroundColor: this.state.themeColor}}>
            <div className="tab-column border-right">
              {settingOptions.map( (item, i) => <div key={i} className={this.state.index === i ? "setting-tabs active" : "setting-tabs"} onClick={this.showSetting.bind(this, i)}>{item}</div>)}
              {<button className="logout-button" onClick={this.props.logout} title={email}>Log Out</button>}
            </div>
            <div className="setting-column">
              {this.renderSetting()}
            </div>
          </div>
        )}
        {this.state.quoteVisible && <DailyQuote newQuote={updateQuote}/>}
        {this.state.weatherVisible ? <WeatherFetch themeColor={this.state.themeColor}/> : null}
        {this.state.todoVisible && <Todo themeColor={this.state.themeColor}/>}
        {this.state.focusVisible && <DailyFocus/>}
        {this.state.noteVisible && <Note themeColor={this.state.themeColor}/>} 
      </div>
    );
  }
}

export default Settings;