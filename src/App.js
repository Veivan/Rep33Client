import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import Calendar from 'react-calendar';
import {saveAs} from 'file-saver';

export default class App extends Component {

constructor(props) {
    super(props);
		let date = new Date(); 
		date.setDate(date.getDate()-1);
	  	this.state = {
			use_timer: "false",
			launch_time: "",
			emails: "",
			launch_date : date,
			rep_save2bd: "false",
			rep_usesaved: "true",
			rep_getfile: "true"		
	  	}; 
	  
	  	//this.config = require('./confdev.json');
	  	this.config = require('./confprod.json');
	}

	handleChange = (event) => {
		let nam = event.target.name;
		let val = event.target.value;
		this.setState({
		  [nam]: val
		});
	}

	handleCalend = (event) => {
		this.setState({
		  launch_date: event
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
		axios.post(this.config.paramsroute, this.state, {
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
	}

	buildsend = () => {
		var params = new URLSearchParams();
		params.append('dateRep', this.state.launch_date.toLocaleDateString("en-US"));
		axios.get(this.config.reportrouteman + "?" + params.toString())
		.then((response) => {
			console.log(response);
		  }, (error) => {
			console.log(error);
		  });
	}

	buildadmin = async () => {
		var params = new URLSearchParams();
		params.append('dateRep', this.state.launch_date.toLocaleDateString("en-US"));
		params.append('isSave', this.state.rep_save2bd);
		params.append('useSavedData', this.state.rep_usesaved);
		params.append('rep_getfile', this.state.rep_getfile);
		
		axios.get(this.config.reportrouteadmin + "?" + params.toString(), {responseType: 'blob', })
/*		.then(response => {
			console.log(response);
		}) */
		.then(response => {
			if (this.state.rep_getfile)
				saveAs(response.data, "?????????? ???? ????????????????????????.xlsx");
		}) 
		.catch(error => {
			console.log(error);
		});
	}
	
	componentDidMount() {
		axios.get(this.config.paramsroute)		
			.then((response) => {
				console.log(response);
				this.setState({use_timer : response.data.use_timer});
				this.setState({launch_time : response.data.launch_time});
				this.setState({emails : response.data.emails});
			})
			.catch(function (error) {
				console.log(error);
			 });
			console.log(this.config.paramsroute)
		}

	render() {

    return (
		<div className='App'>
	   
		<Container>
			<Form>
				<Row>
					<h1>?????????????????? ?????????????????????????????? ??????????????</h1>
					<Form.Text muted>
						???????????????????????? ???????????? ?????????????????????????? ???? ?????????????? ???? '??????????'.<br />
						?????????????????????? ???????????? ???? ????????????????????????.<br />
						?????????? ?????????????????????? ?? ????.<br />
						???????????????? ???????????? ???????????? ??????????????????.
					</Form.Text>
				</Row>
				<br />
				<Row>
					<Col>
						<Form.Check name='use_timer' type="switch" id="use_timerId" 
							label="?????????????????? ???? ??????????????" checked={this.state.use_timer === "true"} 
							onChange={this.handleCheckClick} />
    				</Col>
    				<Col>
						<InputGroup className="mb-3">
							<InputGroup.Text id="basic-addon1">?????????? ??????????????</InputGroup.Text>
    						<FormControl name='launch_time' placeholder="03:00" aria-describedby="basic-addon1" 
								value={this.state.launch_time}
								onChange={this.handleChange} />
  						</InputGroup>
    				</Col>
 				</Row>
				<Row>
					<Col>
						<InputGroup className="mb-3">
							<InputGroup.Text >???????????? ??????????????????</InputGroup.Text>
    						<FormControl name='emails' placeholder="email1, email2..."  
								value={this.state.emails}
								onChange={this.handleChange} />
  						</InputGroup>
    				</Col>

				</Row>
				<Row>
					<Col>
						<Button className='my-2' variant="primary" onClick={this.submit}>??????????????????</Button> 
					</Col>
				</Row>

				<br /><br />

				<Row>
					<h1>?????????????????? ?????????????? ??????????????</h1>
					<Col xs={3}> 
						<Form.Label >???????? ????????????</Form.Label>
						<Form.Control plaintext readOnly value={this.state.launch_date.toLocaleDateString("en-US")} />
					    <Calendar name='launch_date'
    					    onChange={this.handleCalend}
        					value={this.state.launch_date}
      					/>
					</Col>
					<Col> 
						<Form.Text muted>
							???????????????????????? ???????????? ???? ?????????????????? ????????.<br />
							???????????????????????? ?????????????????????? ????????????.<br />
							?????????? ?? ???? ???? ??????????????????????.<br />
							???????????????? ???????????? ???????????? ??????????????????.
						</Form.Text>
						<br />
						<Button className='my-2' variant="primary" onClick={this.buildsend}>?????????????????? ?? ??????????????????</Button> 
					</Col>
					<Col>  
						<Form.Text muted>
							???????????????????????? ???????????? ???? ?????????????????? ????????.<br />
							???????????????????????? ?????????????????????? ???????????? - ???? ????????????????.<br />
							?????????????????? ?????????? ?? ???? - ???? ????????????????.<br />
							?????????????????? ???????? ???????????? ???????????????? - ???? ????????????????.
						</Form.Text>
						<br />
						<Form.Check name='rep_usesaved' type="switch" id="rep_usesavedId" 
							label="???????????????????????? ?????????????????????? ????????????" checked={this.state.rep_usesaved === "true"}
							onChange={this.handleCheckClick} />
						<Form.Check name='rep_save2bd' type="switch" id="rep_save2bdId" 
							label="?????????????????? ?? ????" checked={this.state.rep_save2bd === "true"}
							onChange={this.handleCheckClick} />
						<Form.Check name='rep_getfile' type="switch" id="rep_getfileId" 
							label="?????????????????? ???????? ???????????? ????????????????" checked={this.state.rep_getfile === "true"}
							onChange={this.handleCheckClick} />
						<Button className='my-2' variant="primary" onClick={this.buildadmin}>??????????????????</Button> 
					</Col>
				</Row>

  			</Form>			  
		</Container>
		</div>
   );
  }
}
