import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row } from 'react-bootstrap';
import { InputGroup, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

export default class App extends Component {

constructor(props) {
    super(props);
	  this.state = {
		use_timer: "false",
		launch_time: "",
		save2bd: "false"
	  }; 
	  
	  this.config = require('./confdev.json');
	  //this.config = require('./confprod.json');
	}

	handleChange = (event) => {
		let nam = event.target.name;
		let val = event.target.value;
		this.setState({
		  [nam]: val
		});
	}

	handleCheckClick = (event) => {
		let nam = event.target.name;
		let val = event.target.checked ? "true" : "false";
		this.setState({
		  [nam]: val
		});	  
	}

	submit = () => {
		//axios.post("http://localhost:44446/api/params", this.state, {
		axios.post(this.config.host, this.state, {
			headers: {
		  // Overwrite Axios's automatically set Content-Type
		  'Content-Type': 'application/json'
		}
		})
		.then((response) => {
			console.log(response);
		  }, (error) => {
			console.log(error);
		  });
//		document.location.reload();
	}

	componentDidMount() {
//		axios.get("http://localhost:44446/api/params")
		axios.get(this.config.host)		
			.then((response) => {
				console.log(response);
				this.setState({use_timer : response.data.use_timer});
				this.setState({launch_time : response.data.launch_time});
				this.setState({save2bd : response.data.save2bd});
			})
			.catch(function (error) {
				console.log(error);
			 });
			console.log(this.config.host)
		}

	render() {

    return (
		<div className='App'>
		<h1>Настройки приложения</h1>
	   
		<Container>
		<Form>
  			<Form.Group className="mb-3" controlId="formLaunchSettings" >

				<Form.Check name='use_timer' type="switch" id="use_timerId" label="Использовать таймер" checked={this.state.use_timer === "true"} 
					onChange={this.handleCheckClick} />

				<InputGroup className="mb-3">
					<InputGroup.Text id="basic-addon1">Время запуска</InputGroup.Text>
    				<FormControl name='launch_time' placeholder="03:00" aria-label="Username" aria-describedby="basic-addon1" 
					value={this.state.launch_time}
					onChange={this.handleChange} />
  				</InputGroup>

				<Form.Check name='save2bd' type="switch" id="save2bdId" label="Сохранять в БД" checked={this.state.save2bd === "true"}
					onChange={this.handleCheckClick} />
				<Button className='my-2' variant="primary" onClick={this.submit}>Save</Button> <br /><br />
	  		</Form.Group>
  		</Form>
					  
		</Container>
		</div>
   );
  }
}
