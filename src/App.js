import React, {Component, Fragment} from "react";
import {Link, withRouter} from "react-router-dom";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import "./App.css";
import Routes from "./Routes";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            editing:null
        };
    }


    userHasAuthenticated = authenticated => {
        this.setState({isAuthenticated: authenticated});
    }

    handleLogout = async event => {
        this.userHasAuthenticated(false);

        this.props.history.push("/login");
    }

    setEditing = doc => {
        this.setState({editing: doc});
    }


    render() {

        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            editing: this.state.editing,
            setEditing: this.setEditing
        };
        return (
            <div className="App ">
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        {this.state.isAuthenticated
                            ? <Navbar.Brand>
                                < Link to="/">Система учета документов</Link>
                            </Navbar.Brand>
                            : <Navbar.Brand>
                                < Link to="/table">Система учета документов</Link>
                            </Navbar.Brand>
                        }
                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            {this.state.isAuthenticated
                                ? <NavItem onClick={this.handleLogout}>Выход</NavItem>
                                : <Fragment>
                                    <LinkContainer to="/signup">
                                        <NavItem>Регистрация</NavItem>
                                    </LinkContainer>
                                    <LinkContainer to="/login">
                                        <NavItem>Вход</NavItem>
                                    </LinkContainer>
                                </Fragment>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps}/>
            </div>
        );
    }
}

export default withRouter(App);