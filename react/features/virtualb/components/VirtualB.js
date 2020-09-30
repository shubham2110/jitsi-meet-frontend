import React, {
    Component
} from 'react';

import type { AbstractButtonProps } from '../../base/toolbox/components';
import { AbstractButton, BetaTag } from '../../base/toolbox/components';

import { virtualBDisabled, virtualBEnabled } from '../action';

type Props = AbstractButtonProps & {
  /**
   * The redux {@code dispatch} function.
   */
  dispatch: Function

};

class VirtualB extends AbstractButton<Props, *> {
    state = {
      localImageUrl: false
    };

  componentDidMount() {   
    if (localStorage.getItem("backgroundImage")) {
      var dataImage = localStorage.getItem('backgroundImage');
      this.setState({
        localImageUrl:  dataImage ?  true : false
      });
      }
  }
  
  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }


/*
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
*/

    // On file select (from the pop up) 
  onFileChange = event => {
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
    
       const file = event.target.files[0];
      this.getBase64(file).then(base64 => {
            localStorage["backgroundImage"] = base64;
          //  console.debug("file stored", base64);
          this.setState({
               localImageUrl:  true
          });
        
        if (this.state.localImageUrl) {
          this.props.dispatch(virtualBEnabled());
        }
      });
    

    
  };

  

    // On file upload (click the upload button) 
    deleteImage = () => {
      localStorage.removeItem("backgroundImage");
      this.setState({ localImageUrl: null });
      this.props.dispatch(virtualBDisabled());
    };

    render() {
      return (
        <div> {
                  !this.state.localImageUrl ? (<input type="file"
                        onChange = {
                            this.onFileChange
                        }
          />) : (<div>

            <button onClick={this.deleteImage}>
                Clear Background Image </button>
                        </div>)}  
          </div>
                    )
                }
  }

export default VirtualB;