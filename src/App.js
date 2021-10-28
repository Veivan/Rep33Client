import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import Calendar from 'react-calendar'
import {saveAs} from 'file-saver';

export default class App extends Component {

constructor(props) {
    super(props);
		let date = new Date(); 
		date.setDate(date.getDate()-1);
	  	this.state = {
			use_timer: "false",
			launch_time: "",
			save2bd: "false",
			emails: "",
			launch_date : date,
			rep_save2bd: "false",
			rep_usesaved: "false",
			rep_getfile: "false"		
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
//		document.location.reload();
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
//		document.location.reload();
	}

	buildadmin = () => {
		var params = new URLSearchParams();
		params.append('dateRep', this.state.launch_date.toLocaleDateString("en-US"));
		params.append('isSave', this.state.rep_save2bd);
		params.append('useSavedData', this.state.rep_usesaved);
//		rep_getfile
		axios.get(this.config.reportrouteadmin + "?" + params.toString())
		.then((response) => {
			console.log(response);
		})
		.then(function (response) {
			return response.blob();
		})
		.then(function(blob) {
			saveAs(blob, "yourFilename.xlsx");
		})
		.catch(error => {
			//whatever
		});
//		document.location.reload();
	}
	
	componentDidMount() {
		axios.get(this.config.paramsroute)		
			.then((response) => {
				console.log(response);
				this.setState({use_timer : response.data.use_timer});
				this.setState({launch_time : response.data.launch_time});
				this.setState({save2bd : response.data.save2bd});
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
					<h1>Настройки автоматического запуска</h1>
					<Form.Text muted>
						Формирование отчёта автоматически по таймеру на 'вчера'.<br />
						Сохранённые данные не используются.<br />
						Отчёт сохраняется в БД.<br />
						Отправка отчёта списку адресатов.
					</Form.Text>
				</Row>
				<br />
				<Row>
					<Col>
						<Form.Check name='use_timer' type="switch" id="use_timerId" 
							label="Запускать по таймеру" checked={this.state.use_timer === "true"} 
							onChange={this.handleCheckClick} />
    				</Col>
    				<Col>
						<InputGroup className="mb-3">
							<InputGroup.Text id="basic-addon1">Время запуска</InputGroup.Text>
    						<FormControl name='launch_time' placeholder="03:00" aria-describedby="basic-addon1" 
								value={this.state.launch_time}
								onChange={this.handleChange} />
  						</InputGroup>
    				</Col>
					<Col>
						<Form.Check name='save2bd' type="switch" id="save2bdId" 
							label="Сохранять в БД" checked={this.state.save2bd === "true"}
							onChange={this.handleCheckClick} />
					</Col>
 				</Row>
				<Row>
					<Col>
						<InputGroup className="mb-3">
							<InputGroup.Text >Список адресатов</InputGroup.Text>
    						<FormControl name='emails' placeholder="email1, email2..."  
								value={this.state.emails}
								onChange={this.handleChange} />
  						</InputGroup>
    				</Col>

				</Row>
				<Row>
					<Col>
						<Button className='my-2' variant="primary" onClick={this.submit}>Сохранить</Button> 
					</Col>
				</Row>

				<br /><br />

				<Row>
					<h1>Настройки ручного запуска</h1>
					<Col xs={3}> 
						<Form.Label >Дата отчёта</Form.Label>
						<Form.Control plaintext readOnly value={this.state.launch_date.toLocaleDateString("en-US")} />
					    <Calendar name='launch_date'
    					    onChange={this.handleCalend}
        					value={this.state.launch_date}
      					/>
					</Col>
					<Col> 
						<Form.Text muted>
							Формирование отчёта на выбранную дату.<br />
							Используются сохранённые данные.<br />
							Отчёт в БД не сохраняется.<br />
							Отправка отчёта списку адресатов.
						</Form.Text>
						<br />
						<Button className='my-2' variant="primary" onClick={this.buildsend}>Построить и отправить</Button> 
					</Col>
					<Col>  
						<Form.Text muted>
							Формирование отчёта на выбранную дату.<br />
							Использовать сохранённые данные - из настроек.<br />
							Сохранять отчёт в БД - из настроек.<br />
							Сохранить файл отчёта локально - из настроек.(under construction)
						</Form.Text>
						<br />
						<Form.Check name='rep_usesaved' type="switch" id="rep_usesavedId" 
							label="Использовать сохранённые данные" checked={this.state.rep_usesaved === "true"}
							onChange={this.handleCheckClick} />
						<Form.Check name='rep_save2bd' type="switch" id="rep_save2bdId" 
							label="Сохранить в БД" checked={this.state.rep_save2bd === "true"}
							onChange={this.handleCheckClick} />
						<Form.Check name='rep_getfile' type="switch" id="rep_getfiled" disabled
							label="Сохранить файл отчёта локально" checked={this.state.rep_getfile === "true"}
							onChange={this.handleCheckClick} />
						<Button className='my-2' variant="primary" onClick={this.buildadmin}>Построить</Button> 
					</Col>
				</Row>

  			</Form>			  
		</Container>
		</div>
   );
  }
}
