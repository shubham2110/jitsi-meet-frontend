import React,{Component} from 'react'; 

class BackgroundImage extends Component { 

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
	
	// Create an object of formData 

	// Details of the uploaded file 
	console.log(this.state.selectedFile); 
	
	// Request made to the backend api 
	// Send formData object 
	axios.post("api/uploadfile", formData); 
	}; 
	
	// File content to be displayed after 
	// file upload is complete 
 
	
	render() { 
	
	return ( 
		<div> 
			<h1> 
			GeeksforGeeks 
			</h1> 
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

export default BackgroundImage; 
