import React, { Component } from "react";
import {
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import "./index.css";
import axios from "axios";
import {urlPort} from "../../index";


export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        };
    }

    validateForm() {
        return (
            this.state.username.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });
        this.setState({ isLoading: true });
        var params = new URLSearchParams();
        params.append('username', this.state.username);
        params.append('password', this.state.password);
        params.append('email', this.state.username);
        axios.post(urlPort('/signUp'), params, {withCredentials: true})
            .then(
                res => {
                    let history = this.props.history;
                    history.push('/login');
                }
            ).catch(
            err => {
                this.setState({ isLoading: false });
            }
        );
    }


    renderForm() {
        return (
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
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        value={this.state.email}
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
                <FormGroup controlId="confirmPassword" bsSize="large">
                    <ControlLabel>Подтверждение пароля</ControlLabel>
                    <FormControl
                        value={this.state.confirmPassword}
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
                    text="Регистрация"
                    loadingText="Регистрируемся"
                />
            </form>
        );
    }

    render() {
        return (
            <div className="Signup">
                {this.renderForm()}
            </div>
        );
    }
}