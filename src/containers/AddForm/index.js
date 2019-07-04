import React, {Component} from "react";
import "./index.css";
import axios from 'axios'
import {urlPort} from "../../index";
import {FormGroup, FormControl, ControlLabel, Form, Button} from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import Autosuggest from 'react-autosuggest';

export default class AddForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            suggestions: [],
            id: "",
            isLoading: false,
            receiving_date: "",
            info: "",
            judge: "",
            case_number: "",
            plaintiff: "",
            defendant: "",
            execution_date: "",
            closing_number: "",
            closing_date: "",
            sending_date: "",
            status: "",
            value: "",
            courts: [],
            is_executed: false
        };
    }

    renderSuggestion = suggestion => (
        <div>
            {suggestion}
        </div>
    );

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.state.courts.filter(court =>
            court.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };


    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    getSuggestionValue = suggestion => suggestion;


    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    componentDidMount() {
        axios.get(urlPort('/courts'), {withCredentials: true})
            .then(
                res => {
                    this.setState({courts: res.data});
                }
            ).catch(err => {
                let history = this.props.history;
                history.push('/login');
            }
        );
    }

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    submitOk() {
        var block = document.getElementById("message");
        block.innerText = "Сохранение прошло успешно";
        block.style.color = "darkgreen";
        block.style.visibility = "visible";
    }

    submitFail() {
        var block = document.getElementById("message");
        block.innerText = "Ошибка соединения с сервером";
        block.style.color = "crimson";
        block.style.visibility = "visible";
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isLoading: true});
        var params = new URLSearchParams();
        params.append('idStr', this.state.id);
        params.append('receivingDateStr', this.state.receiving_date);
        params.append('info', this.state.info);
        params.append('court', this.state.value);
        params.append('judge', this.state.judge);
        params.append('caseNumber', this.state.case_number);
        params.append('plaintiff', this.state.plaintiff);
        params.append('defendant', this.state.defendant);
        params.append('executionDateStr', this.state.execution_date);
        params.append('closingNumber', this.state.closing_number);
        params.append('closingDateStr', this.state.closing_date);
        params.append('sendingDateStr', this.state.sending_date);
        params.append('status', this.state.status);
        axios.post(urlPort('/edit'), params, {withCredentials: true})
            .then(
                res => {
                    this.submitOk();
                    this.setState({isLoading: false});
                }
            ).catch(
            err => {
                if (err.response.status === 401) {
                    let history = this.props.history;
                    history.push('/login');
                } else {
                    this.submitFail();
                    this.setState({isLoading: false});
                }
            }
        );
    }

    back = event => {
        event.preventDefault();
        let history = this.props.history;
        history.push('/table');
    }

    render() {

        const {value, suggestions} = this.state;
        const inputProps = {
            value,
            onChange: this.onChange
        };
        return (
            <div className="AddForm">

                <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="column left">
                            <FormGroup controlId="info" bsSize="large">
                                <ControlLabel>Получено</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.info}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="receiving_date" bsSize="large">
                                <ControlLabel>Дата получения</ControlLabel>
                                <FormControl
                                    type="date"
                                    value={this.state.receiving_date}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="execution_date" bsSize="large">
                                <ControlLabel>Дата исполнения</ControlLabel>
                                <FormControl
                                    type="date"
                                    value={this.state.execution_date}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="value" bsSize="large">
                                <ControlLabel>Наименование суда</ControlLabel>
                                <Autosuggest
                                    suggestions={suggestions}
                                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                    getSuggestionValue={this.getSuggestionValue}
                                    renderSuggestion={this.renderSuggestion}
                                    inputProps={inputProps}
                                />
                            </FormGroup>
                            <FormGroup controlId="judge" bsSize="large">
                                <ControlLabel>Судья</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.judge}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="status" bsSize="large">
                                <ControlLabel>Статус</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.status}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        </div>
                        <div className="column right">
                            <FormGroup controlId="case_number" bsSize="large">
                                <ControlLabel>№ дела</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.case_number}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="plaintiff" bsSize="large">
                                <ControlLabel>Ответчик</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.plaintiff}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="defendant" bsSize="large">
                                <ControlLabel>Истец</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.defendant}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="closing_number" bsSize="large">
                                < ControlLabel>№ заключения </ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.closing_number}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="closing_date" bsSize="large">
                                <ControlLabel>Дата заключения</ControlLabel>
                                <FormControl
                                    type="date"
                                    value={this.state.closing_date}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup
                                controlId="sending_date"
                                bsSize="large">
                                < ControlLabel> Дата
                                    отправления </ControlLabel>
                                <FormControl
                                    type="date"
                                    value={this.state.sending_date}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        </div>
                    </div>

                    <LoaderButton
                        block
                        bsSize="large"
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Сохранить"
                        loadingText="Сохранение изменений"
                    />
                    <div id="message">Сохранение прошло успешно</div>
                </Form>
                <Button onClick={this.back}>К списку дел</Button>
            </div>
        );
    }
}


