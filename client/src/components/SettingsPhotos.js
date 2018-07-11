import React from 'react';

const PhotoTab = (props) => {
  var photosData = Array.from(props.photosData);
  return(
      <div>
          {props.length === 0 && props.index === 0 && <div className="middle container">Personalize your inspiration by adding your own photos<br/>
      Click + Add Photo to get started</div>}
          {props.length === 0 && props.index === 1 && <div className="middle container">Click the heart icon near a photo to start your collection<br/>
      No favorite photos</div>}
          {props.length > 0 && photosData.map( (item,i) =>
        <div key={item._id} className="thumbnail-container">
          <img className="thumbnail" src={item.url} alt="pic" onClick={()=>props.changeBG(item.url)}/>
          <div className="set-active" title="Set Active" onClick={()=>props.changeBG(item.url)}>✓</div>
          <div className="set-favorite" title={item.favorite === false ? "Set favorite" : "Unfavorite"} onClick={()=>{
          item.favorite === true ? item.favorite = false : item.favorite = true;
          fetch(`/photos/${item._id}`,{
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
          {item.myPhoto && <div className="delete" title="Delete photo"
          onClick={() => {
            fetch(`/photos/${item._id}`,{
              method: 'DELETE',
            });
            props.deletePhoto(item,i);
          }}>
          &times;</div>}
        </div>)}
      </div>
  );
}

class SettingsPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: '',
      index: 2,
      upload: false,
      isLoading: true,
      msg: '',
    };

    this.clickAdd = this.clickAdd.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.toggleFav = this.toggleFav.bind(this);
    this.changeBG = this.changeBG.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
  }

  componentDidMount(){
    this.fetching = true;
    fetch('/photos', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (this.fetching){
          this.setState({isLoading: false, photos: data});
        }
      })
  }

  componentWillUnmount(){
    this.fetching = false;
  }

  toggleFav(item){
      this.setState({[item]: item});
  }

  deletePhoto(item, i){
    const {photos} = this.state;
    photos.splice(i,1);
    this.setState({photos, msg: `${item.fileName} will be deleted`});
  }

  showTab(i){
    this.setState({ index: i })
  }

  handleUploadImage(ev) {
    ev.preventDefault();
    this.setState({msg: 'Uploading...'});
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.uploadInput.files[0].name);
    fetch('/photos', {
      method: 'POST',
      credentials: 'include',
      body: data,
    })
    .then(response => response.json())
    .then((body) => {
      if (body.success === false){
        this.setState({msg: body.message})
      } else {
        const storedPhotos = this.state.photos;
        storedPhotos.unshift(body);
        this.setState({photos: storedPhotos, msg: ''});
        this.changeBG(body.url);
      }
    })
    .catch(error => {
      this.setState({msg: error});
      console.error('Error during upload()', error);
    });
  }

  clickAdd() {
    const { upload } = this.state;
    this.setState({
      upload: !upload,
    });
  }

  changeBG(url){
    document.body.style.backgroundImage = `url(${url})`;    
    var customStored = JSON.parse(localStorage.getItem('customization'));
    customStored.bg = url;
    localStorage.setItem("customization", JSON.stringify(customStored));
  }

  renderTab(){
    const { photos } = this.state;
    const { index } = this.state;
    
    if (photos.length > 0){
      var favorites = photos.filter((photo) => photo.favorite === true);
      var myPhotos = photos.filter((photo) => photo.myPhoto === true);
      var photoArray = [myPhotos, favorites, photos];
      var photosData = photoArray[index];
      return (
        <PhotoTab
          index={index}
          photosData={photosData}
          changeBG={this.changeBG}
          toggleFav={this.toggleFav}
          deletePhoto={this.deletePhoto}
          length={photosData.length}
          _id={photosData._id}
          url={photosData.url}
          favorite={photosData.favorite}
          />
      ) 
    }
  }

render() {
  const photoOptions = ["MY PHOTOS","FAVORITES", "HISTORY"]
  const { isLoading } = this.state;
  return (
    <div>
      <div style={{fontSize: 20, marginBottom: 4}}>Photos</div>
      <div style={{fontSize: 12, color: '#999', marginBottom: 5}}>See a new inspiring photo each day</div>
      <div className="container">
        {photoOptions.map( (key, i) =>
          <div key={i} className={this.state.index===i ? "left-options active" : "left-options"} onClick={this.showTab.bind(this, i)}>{key}</div>)}
        <button className="submit-button" onClick={this.clickAdd}>+ Add Photo</button>
        {this.state.upload &&
        <div>
        <form className="container" onSubmit={this.handleUploadImage}>
          <input className="left" ref={(ref) => { this.uploadInput = ref; }} type="file" required/>
          <button className="submit-button">Upload</button>
        </form>
        </div>}
        {this.state.msg && <div className="right">{this.state.msg}</div>}
      </div>
      <div className="container">
        {isLoading ? <div><div className="setting spinner"></div> <div className="loading">Loading...</div></div> : this.renderTab()}</div>
    </div>
  );
}
}

export default SettingsPhotos;