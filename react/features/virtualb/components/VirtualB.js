import React, {
    Component
} from 'react';

class VirtualB extends Component {
    state = {
      localImageUrl: null
    };

  componentDidMount() {
      
    if (localStorage.getItem("backgroundImage")) {
      this.setState({
        localImageUrl : URL.createObjectURL(localStorage.getItem("backgroundImage"))
      })
      }
    }

    // On file select (from the pop up) 
    onFileChange = event => {

        // Update the state 
        this.setState({
          localImageUrl: URL.createObjectURL(event.target.files[0])
        });
        localStorage.setItem('backgroundImage', event.target.files[0]);

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