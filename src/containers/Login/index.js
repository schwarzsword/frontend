import React, {Component} from "react";
import "./index.css";
import axios from 'axios'
import {urlPort} from "../../index";
import {FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            username: "",
            password: ""
        };
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isLoading: true});
        var params = new URLSearchParams();
        params.append('username', this.state.username);
        params.append('password', this.state.password);
        axios.post(urlPort('/login'), params, {withCredentials: true})
            .then(
                res => {
                    this.props.userHasAuthenticated(true);
                    this.authSuccess();
                    let history = this.props.history;
                    history.push('/table');
                }
            ).catch(
            err => {
                if (err.response.status === 401) {
                    this.authFail();
                    this.setState({isLoading: false});
                } else {
                    this.submitFail();
                    this.setState({isLoading: false});
                }
            }
        );
    }

    authFail() {
        var block = document.getElementById("error");
        block.innerText = "Неверные имя пользователя или пароль";
        block.style.visibility = "visible";
    }

    authSuccess() {
        var block = document.getElementById("error");
        block.style.visibility = "hidden";
    }

    submitFail() {
        var block = document.getElementById("error");
        block.innerText = "Ошибка соединения с сервером";
        block.style.visibility = "visible";
    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="username" bsSize="large">
                        <ControlLabel>Имя пользователя</ControlLabel>
                        <FormControl
                            autoFocus
                            type="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Пароль</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Войти"
                        loadingText="Входим"
                    />
                </form>
                <div id="error">Неверные имя пользователя или пароль</div>
            </div>
        );
    }
}