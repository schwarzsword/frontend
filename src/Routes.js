import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import Signup from "./containers/Signup";
import AddForm from "./containers/AddForm";
import MyTable from "./containers/MyTable";



export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute path="/login" exact component={Login} props={childProps} />
        <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
        <AppliedRoute path="/table" exact component={MyTable} props={childProps} />
        <AppliedRoute path="/edit" exact component={AddForm} props={childProps} />
        { /* Finally, catch all unmatched routes */ }
        <Route component={NotFound} />
    </Switch>;