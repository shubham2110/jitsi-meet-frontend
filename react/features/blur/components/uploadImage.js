import React, { Component } from 'react'; 
 
import { createVideoBlurEvent, sendAnalytics } from '../../analytics';
import { translate } from '../../base/i18n';
import { IconBlurBackground } from '../../base/icons';
import { connect } from '../../base/redux';
import { AbstractButton, BetaTag } from '../../base/toolbox/components';
import type { AbstractButtonProps } from '../../base/toolbox/components';
import { toggleBlurEffect } from '../actions';

class UploadBackGroundImage extends AbstractButton<Props, *>  { 

    accessibilityLabel = 'toolbar.accessibilityLabel.videoblur';
    icon = IconBlurBackground;
    label = 'Upload Background Image';
    tooltip = 'Background Image';
    toggledLabel = 'image';

	state = { 

	// Initially, no file is selected 
	selectedFile: null
	}; 
	
	// On file select (from the pop up) 
	onFileChange = event => { 
	
	// Update the state 
        this.setState({ selectedFile: event.target.files[0] });
	console.log(this.state.selectedFile); 
        
	
    }; 
    
    _handleClick() {
        this.onFileUpload();
    }
	
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
