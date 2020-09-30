import React, {
    Component
} from 'react';

class VirtualB extends Component {
    state = {
      localImageUrl: null
    };

  componentDidMount() {
      
    if (localStorage.getItem("backgroundImage")) {
      var dataImage = localStorage.getItem('backgroundImage');
      this.setState({
        localImageUrl:  dataImage
       // localImageUrl: "data:image/png;base64," + dataImage
      });
      }
  }
  
  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    };
  }



   getBase64Image = (img) => {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // var ctx = canvas.getContext("2d");
    // ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

     console.log(dataURL);
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

    // On file select (from the pop up) 
  onFileChange = event => {

       const file = e.target.files[0];
      this.getBase64(file).then(base64 => {
            localStorage["backgroundImage"] = base64;
            console.debug("file stored", base64);
        });


        // Update the state 
      /*
        let imgData = this.getBase64Image(event.target.files[0]);
      localStorage.setItem("backgroundImage", imgData);
      
      var dataImage = localStorage.getItem('backgroundImage');
      let dataurl = "data:image/png;base64," + dataImage;
      console.log('imageDtata', dataurl)
        this.setState({
          localImageUrl: dataurl
        });
        */
    };

    // On file upload (click the upload button) 
    deleteImage = () => {
        localStorage.setItem('backgroundImage', null);
    };

    render() {
      return (
        <div> {
                  !this.state.localImageUrl ? (<input type="file"
                        onChange = {
                            this.onFileChange
                        }
          />) : (<div>
              <img src={this.state.localImageUrl} />
            <button onClick={this.deleteImage}>
                Clear Background Image </button>
                        </div>)}  
          </div>
                    )
                }
  }

export default VirtualB;