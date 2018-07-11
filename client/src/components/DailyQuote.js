import React from 'react';

function getDate(){
    var d = new Date();
    d.setDate(d.getDate()); 
    return d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
}
  
class DailyQuote extends React.Component {
	constructor(props) {
        super(props);
        
        if (localStorage.getItem("quote") !== null ){
            const quoteCache = JSON.parse(localStorage.getItem("quote"));
            this.state = {
                quote: quoteCache.quote,
                author: quoteCache.author,
                date: quoteCache.date,
                isLoading: true
            }
        } else {
            this.state = {
                quote: '',
                author: '',
                date: getDate(),
                isLoading: true,
            };
        }
	}

	async componentDidMount() {
        this.setState({
            isLoading: false
        })

        if ((localStorage.getItem("quote") !== null &&
        JSON.parse(localStorage.getItem("quote")).date !== getDate()) || localStorage.getItem("quote") === null){
            const quotes_api = await fetch(`https://quotes.rest/qod.json?category=inspire`);
            const response = await quotes_api.json();
            this.setState({
                quote: response.contents.quotes[0].quote,
                author: response.contents.quotes[0].author||'Unknown',
                date: getDate(),
                isLoading: false
            })
            const quote = {
                quote: this.state.quote,
                author: this.state.author,
                date: this.state.date,
            }
            localStorage.setItem("quote", JSON.stringify(quote));
        
            fetch('/quotes', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quote: this.state.quote,
                    author: this.state.author,
                    date: this.state.date,
                    myQuote: false,
                    owner: "default"
            })})
        }
    }

	render() {
        const { isLoading } = this.state;
        return (
            <div>
                {isLoading ? <div className="quote spinner"></div>
                :
                this.props.newQuote ?
                <div className="quote">"{this.props.newQuote.quote}"
                    <div className="author">{this.props.newQuote.author}</div>
                </div>
                :
                <div className="quote">“{this.state.quote}”
                    <div className="author">{this.state.author}</div>
                </div>}
            </div>
        );
    }
}

export default DailyQuote;