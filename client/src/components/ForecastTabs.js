import React from 'react';
import "./weather-icons.min.css";

const ForecastTab = (props) => {
  return(
    <div>
      <span style={{marginBottom: '4'}}>{props.location} ({props.day})</span><br/>
      <span style={{marginBottom: '10'}}>{props.text}</span><br/>
      <div className="forecast-info"><i className={'wi wi-yahoo-'+props.code} style={{fontSize: 50}}/> {props.high}°<div className="temp">{props.low}°</div></div>      
    </div>
  );
}

class ForecastTabs extends React.Component {
  constructor() {
		super();
		this.state = { key: 0 };
	}

  showForecast(i){
    this.setState({ key: i })
  }

  renderForecast(){
    const {forecast, location} = this.props;
    const {key} = this.state;
    const forecastData = forecast[key];
    return (
      <ForecastTab
        location={location}
        day={forecastData.day}
        text={forecastData.text}
        code={forecastData.code}
        high={forecastData.high}
        low={forecastData.low}
        />
    ) 
  }

    render() {

      const {forecast} = this.props;
      
      return (
          <div>
            {this.renderForecast()}
            <hr/>
            {Object.keys(forecast).map( key =>
            <div key={key} className="forecast" onClick={this.showForecast.bind(this, key)} title={forecast[key].text}>
            {forecast[key].day.toUpperCase()} <br/><div className="temp"><i className={'wi wi-yahoo-'+forecast[key].code}/> {forecast[key].high}° {forecast[key].low}°</div>
            </div>)}
          </div>
      )
    }
}

export default ForecastTabs;