import React from 'react';
  
const QuoteTab = (props) => {
    var quotesData = Array.from(props.quotesData);
    return(
        <div>
            {props.length === 0 && props.index === 0 && <div className="middle container">Power up your day with your favorite quotes<br/>
        Click + Add Quote to get started</div>}
            {props.length === 0 && props.index === 1 && <div className="middle container">Click the heart icon near a quote to start your collection<br/>
        No favorite quotes</div>}
            {props.length > 0 && quotesData.map( (item,i)  =>
            <div key={item._id} title={item.date} className="container container-style">
            <div className="quote-history">“{item.quote}” <div className="quote-author">{item.author}</div>
            </div>
            <div className="right large-font user-select-none cursor-pointer" title={item.favorite === false ? "Set favorite" : "Unfavorite"} onClick={()=>{
            item.favorite === true ? item.favorite = false : item.favorite = true
            fetch(`/quotes/${item._id}`,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(item), 
            });
            props.toggleFav(item);
            }}>
            {item.favorite === true ? '♥' : '♡'}</div>
            <div className="right large-font user-select-none cursor-pointer" title="Set Active" onClick={
            () => {
            const quoteCache = JSON.parse(localStorage.getItem("quote"))||{};
            quoteCache.quote = item.quote;
            quoteCache.author = item.author;
            props.quoteUpdate(quoteCache);
            localStorage.setItem("quote", JSON.stringify(quoteCache));
        }}>✓</div></div>)}
        </div>
    );
}

class SettingsQuotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quotes: {},
      quote: '',
      author: '',
      index: 2,
      upload: false,
      isLoading: true,
      msg: '',
    };

    this.clickAdd = this.clickAdd.bind(this);
    this.addQuote = this.addQuote.bind(this);
    this.toggleFav = this.toggleFav.bind(this);
  }

toggleFav(item){
    this.setState({[item]: item});
}

componentDidMount(){
    this.fetching = true;
    fetch('/quotes', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (this.fetching){
            this.setState({
                quotes: data,
                isLoading: false
            })
        }
    })
    .catch(error => {
        this.setState({error: 'Error fetching quotes. Please check your network connection.'});
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

showTab(i){
    this.setState({ index: i })
}

renderTab(){
    const { quotes } = this.state;
    const { index } = this.state;
    
    if (quotes.length === 0)
        return (<div className="middle container">You will see your past quotes here.<br/>
                Can't find any history for this account</div>)
    else if (quotes.length > 0){
        var favorites = quotes.filter((quote) => quote.favorite === true);
        var myQuotes = quotes.filter((quote) => quote.myQuote === true);
        var quoteArray = [myQuotes, favorites, quotes];
        const quotesData = quoteArray[index];
        return (
            <QuoteTab
              index={index}
              quotesData={quotesData}
              toggleFav={this.toggleFav}
              quoteUpdate={this.props.quoteUpdate}
              length={quotesData.length}
              _id={quotesData._id}
              date={quotesData.date}
              quote={quotesData.quote}
              author={quotesData.author}
              favorite={quotesData.favorite}
              />
        ) 
    }
}

addQuote(quote, author){
    this.setState({quote, author, msg: 'Uploading...'}, () => {
        const newQuote = {
            quote: this.state.quote,
            author: this.state.author||'Unknown',
            myQuote: true,
        };
        fetch('/quotes', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newQuote)
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success){
                this.setState({msg: data.message});
            } else {
                newQuote._id = data._id;
                const storedQuotes = this.state.quotes;
                storedQuotes.unshift(newQuote);
                this.setState({quotes: storedQuotes, msg: ''});
            }
        })
        .catch(error => {
            this.setState({error: 'Error adding quote.'});
            console.error('Error during adding quote', error);
        })
    });
}

render() {
    const quoteOptions = ["MY QUOTES","FAVORITES", "HISTORY"]
    const { isLoading } = this.state;
    let quote, author;
    return (
        <div>
            <div style={{fontSize: 20, marginBottom: 4}}>Quotes</div>
            <div style={{fontSize: 12, color: '#999', marginBottom: 5}}>A daily reminder for inspiration and growth</div>
            <div className="container">
                {quoteOptions.map( (key, i) =>
                <div key={i} className={this.state.index===i ? "left-options active" : "left-options"} onClick={this.showTab.bind(this, i)}>{key}</div>)}
                <button className="submit-button" onClick={this.clickAdd}>+ Add Quote</button>
                {this.state.upload &&
                <form>
                    <div className="container">
                    <button className="submit-button" type="submit" onClick={(e) => {
                            e.preventDefault();
                            this.addQuote(quote.value, author.value);
                            quote.value = ''; author.value = '';
                            }}>Upload</button>
                    <input className="input-style long-width" type="text" placeholder="Quote" ref={node => { quote = node; }} required/><br/><br/>
                    <input className="input-style" type="text" placeholder="Author" ref={node => { author = node; }} required/><br/><br/>
                    </div>
                </form>}
                {this.state.msg && <div className="right">{this.state.msg}</div>}
                {isLoading ? <div><div className="setting spinner"></div> <div className="loading">Loading...</div></div> : this.renderTab()}
            </div>
        </div>
    );
  }
}
  
export default SettingsQuotes;