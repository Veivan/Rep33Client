import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import Calendar from 'react-calendar'

export default class App extends Component {

constructor(props) {
    super(props);
	  this.state = {
		use_timer: "false",
		launch_time: "",
		save2bd: "false",
		launch_date : new Date(),
		rep_save2bd: "false",
		rep_usesaved: "false",
		rep_getfile: "false"
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
		  }, (error) => {
			console.log(error);
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
					<Form.Control plaintext readOnly value="Формирование отчёта автоматически по таймеру на 'вчера'." />
					<Form.Control plaintext readOnly value="Отчёт сохраняется в БД. Сохранённые данные не используются." />
					<Form.Control plaintext readOnly value="Отправка отчёта списку адресатов." />
				</Row>
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
					<Col>
						<Button className='my-2' variant="primary" onClick={this.submit}>Сохранить</Button> 
					</Col>
 				</Row>
				<br /><br />

				<Row>
					<h1>Настройки ручного запуска</h1>
					<Col xs={3}> 
						<Form.Label >Дата отчёта</Form.Label>
						<Form.Control plaintext readOnly value={this.state.launch_date} />
					    <Calendar name='launch_date'
    					    onChange={this.handleCalend}
        					value={this.state.launch_date}
      					/>
					</Col>
					<Col> 
						<Form.Control plaintext readOnly value="Формирование отчёта на выбранную дату." />
						<Form.Control plaintext readOnly value="Используются сохранённые данные." />
						<Form.Control plaintext readOnly value="Отчёт в БД не сохраняется." />
						<Form.Control plaintext readOnly value="Отправка отчёта списку адресатов." />
						<br /><br />
						<Button className='my-2' variant="primary" onClick={this.buildsend}>Построить и отправить</Button> 
					</Col>
					<Col> 
						<Form.Control plaintext readOnly value="Формирование отчёта на выбранную дату." />
						<Form.Control plaintext readOnly value="Использовать сохранённые данные - из настроек." />
						<Form.Control plaintext readOnly value="Сохранять отчёт в БД - из настроек." />
						<Form.Control plaintext readOnly value="Сохранить файл отчёта локально - из настроек." />
						<br /><br />
						<Form.Check className="d-flex" name='rep_usesaved' type="switch" id="rep_usesavedId" 
							label="Использовать сохранённые данные" checked={this.state.rep_usesaved === "true"}
							onChange={this.handleCheckClick} />
						<Form.Check className="d-flex" name='rep_save2bd' type="switch" id="rep_save2bdId" 
							label="Сохранить в БД" checked={this.state.rep_save2bd === "true"}
							onChange={this.handleCheckClick} />
						<Form.Check className="d-flex" name='rep_getfile' type="switch" id="rep_getfiled" 
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
