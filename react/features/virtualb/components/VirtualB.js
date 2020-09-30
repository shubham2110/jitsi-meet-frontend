import React, {
    Component
} from 'react';

class VirtualB extends Component {
    state = {

        // Initially, no file is selected 
        selectedFile: null
    };

    componentDidMount() {
        this.setState({
            selectedFile = localStorage.getItem("backgroundImage")
        })
    }

    // On file select (from the pop up) 
    onFileChange = event => {

        // Update the state 
        this.setState({
            selectedFile: URL.createObjectURL(event.target.files[0])
        });



    };

    // On file upload (click the upload button) 
    deleteImage = () => {
        localStorage.setItem('backgroundImage', null);
    };

    render() {
      return (
        <div> {
                  !this.state.selectedFile ? (<input value="Virtual Background" type="file"
                        onChange = {
                            this.onFileChange
                        }
                        />) : (<button onClick={this.deleteImage}>
                        Clear </button>)}  
          </div>
                    )
                }
  }

export default VirtualB;