import React, { Component } from 'react';

class VirtualB extends Component {
    state = { 
  
        // Initially, no file is selected 
        selectedFile: null
      }; 
       
      // On file select (from the pop up) 
      onFileChange = event => { 
       
        // Update the state 
        this.setState({
            selectedFile: URL.createObjectURL(event.target.files[0])
          });
        

       
      }; 
       
      // On file upload (click the upload button) 
      onFileUpload = () => { 
       
        // Details of the uploaded file 
        localStorage.setItem("backgroundImage", this.state.selectedFile);
        console.log(this.state.selectedFile); 
      }; 
       
    render() { 
        return (
            <div>
                <input type="file" onChange={this.onFileChange} /> 
                <button onClick={this.onFileUpload}> 
                  Upload! 
                </button> 
                <img src={this.state.selectedFile}/>

                </div>
        )
    }
}
 
export default VirtualB;


