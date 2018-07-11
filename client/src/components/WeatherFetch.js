import React from 'react';
import ForecastTabs from "./ForecastTabs";
import "./weather-icons.min.css";

const WeatherInfo = (props) => {
    return(
      <div className="weather">
        <div style={{fontSize: 20}}><i className={props.className}/> {props.temp}°</div>
        <div style={{fontSize: 8, textAlign: 'center'}}>{props.location.toUpperCase()}</div>
      </div>
    );
}

class WeatherFetch extends React.Component {

	constructor(props) {
		super(props);
        if (localStorage.getItem('weather') !== null && localStorage.getItem('geolocation') !== null) {
            var weather = JSON.parse(localStorage.getItem('weather'));
            var geolocation = JSON.parse(localStorage.getItem('geolocation'));
            this.state = {
                latitude: geolocation.latitude,
                longitude: geolocation.longitude,
                temp: weather.item.condition.temp,
                location: weather.location.city,
                weather_code: weather.item.condition.code,
                description: weather.item.condition.text,
                forecast: JSON.parse(localStorage.getItem('forecast')),
                opened: false,
                isLoading: false,
                isLoadingLocation: false              
            };
        } else {
            this.state = {
                latitude: '',
                longitude: '',
                error: '',
                temp: '',
                location: '',
                weather_code: '',
                description: '',
                forecast: '',
                opened: false,
                isLoading: true,
                isLoadingLocation: true
        };
    }
        this.clickWeather = this.clickWeather.bind(this);
    }
    
    componentDidMount() {
        this.intervalId = setInterval(() => this.fetchData(), 300000);
        this.fetchData();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    fetchData(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const geolocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            localStorage.setItem('geolocation', JSON.stringify(geolocation));
    
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                isLoadingLocation: false,
                error: null
            },() => this.fetchWeather())
            },
            (error) => {
                this.setState({error: 'Error fetching weather infomation. Location is not available.'});
                console.error('Error during fetch()', error);
            }
        );
    }

    fetchWeather() {
        var geolocation = JSON.parse(localStorage.getItem('geolocation'));
        var lat = geolocation.latitude;
        var lon = geolocation.longitude;
        
        this.fetchRequest = fetch(`https://query.yahooapis.com/v1/public/yql?q=select%20woeid%20from%20geo.places%20where%20text%3D"(${lat},${lon})"%20limit%201&diagnostics=false&format=json`)
            .then(response => response.json())
            .then(data => {const ID = data.query.results.place.woeid;

                fetch(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20=${ID}%20and%20u=%27c%27&format=json`)
                .then(response => response.json())
                .then(data => {const weather = data.query.results.channel;
                    localStorage.setItem('weather', JSON.stringify(weather));
                    this.setState({
                        temp: weather.item.condition.temp,
                        location: weather.location.city,
                        weather_code: weather.item.condition.code,
                        description: weather.item.condition.text,
                        isLoading: false
                    });
                })
                
                fetch(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20=${ID}%20and%20u=%27c%27&format=json`)
                .then(response => response.json())
                .then(data => {const forecast = data.query.results.channel.item.forecast;
                    forecast.splice(5,9);
                    localStorage.setItem('forecast', JSON.stringify(forecast));
                    this.setState({forecast: forecast});
                })
                .catch(error => {
                    this.setState({error: 'Error fetching weather infomation. Please check your network connection.'});
                    console.error('Error during fetch()', error);
                })
        })                
    }
    
    clickWeather() {
        const { opened } = this.state;
        this.setState({
            opened: !opened,
        });
    }

	render() {
        let className = 'wi wi-yahoo-'+this.state.weather_code;
        const { isLoading, isLoadingLocation } = this.state;
        return (
            <div>
                {isLoadingLocation ?
                <div>
                    <div className="weather" style={{fontSize: 8}}>SETTING LOCATION</div>
                    <div className="spinner"></div>
                    <div className="error">{this.state.error}</div>
                </div> : isLoading ?
                <div>
                    <div className="weather" style={{fontSize: 8}}>FETCHING WEATHER</div>
                    <div className="spinner"></div>
                    <div className="error">{this.state.error}</div>
                </div> :
                <div onClick={this.clickWeather} title={this.state.description}>
                    <WeatherInfo
                    temp={this.state.temp}
                    location={this.state.location}
                    weather_code={this.state.weather_code}
                    className={className}
                    />
                    <div className="error">{this.state.error}</div>
                </div>}
                
                {this.state.opened &&
                <div id="weather-content" style={{backgroundColor: this.props.themeColor}}>
                    <ForecastTabs forecast={this.state.forecast} location={this.state.location}/>
                </div>}
            </div>
        )
	}
}

export default WeatherFetch;