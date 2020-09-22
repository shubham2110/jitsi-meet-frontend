 import React,{Component} from 'react'; 

class UploadBackGroundImage extends Component { 

	state = { 

	// Initially, no file is selected 
	selectedFile: null
	}; 
	
	// On file select (from the pop up) 
	onFileChange = event => { 
	
	// Update the state 
	this.setState({ selectedFile: event.target.files[0] }); 
	
	}; 
	
	// On file upload (click the upload button) 
	onFileUpload = () => { 
	
	
	// Details of the uploaded file 
	console.log(this.state.selectedFile); 
	
	}; 
	 
	
	render() { 
	
	return ( 
		<div> 
			<h3> 
			File Upload using React! 
			</h3> 
			<div> 
				<input type="file" onChange={this.onFileChange} /> 
				<button onClick={this.onFileUpload}> 
				Upload! 
				</button> 
			</div> 
		</div> 
	); 
	} 
} 

export default UploadBackGroundImage; 
