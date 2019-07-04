import React, {PureComponent} from "react";
import "./index.css";
import {Button} from "react-bootstrap";
import {MDBDataTable, MDBBtn} from 'mdbreact';
import axios from "axios";
import {urlPort} from "../../index";

Date.prototype.ddmmyyyy = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [(dd > 9 ? '' : '0') + dd, (mm > 9 ? '' : '0') + mm, this.getFullYear()].join('/');
};

export default class MyTable extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                columns: [],
                rows: [],

            },
            chosen: {},
            documents: []
        };
    }

    edit = event => {
        var params = new URLSearchParams();
        params.append('username', this.state.chosen.id);
        axios.get(urlPort('/delete'), {withCredentials: true})
            .then(
                res => {
                    this.render();
                }).catch(err => {

        });
    };
    handleAdd = event => {
        let history = this.props.history;
        history.push('/edit');
    }

    componentDidMount() {
        let columns = [
            {
                label: '№',
                field: 'id',
                sort: 'asc',
                width: 0
            },
            {
                label: 'Дата получения',
                field: 'receiving_date',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Что получено',
                field: 'info',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Наименование суда',
                field: 'court',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Судья (ФИО)',
                field: 'judge',
                sort: 'asc',
                width: 150
            },
            {
                label: '№ дела',
                field: 'case_number',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Истец',
                field: 'plaintiff',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Ответчик',
                field: 'defendant',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Дата исполнения',
                field: 'execution_date',
                sort: 'asc',
                width: 100
            },
            {
                label: '№ заключения',
                field: 'closing_number',
                sort: 'asc',
                width: 100
            }, {
                label: 'Дата заключения',
                field: 'closing_date',
                sort: 'asc',
                width: 100
            }, {
                label: 'Дата отправления',
                field: 'sending_date',
                sort: 'asc',
                width: 100
            }, {
                label: 'Статус',
                field: 'status',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Изменение',
                field: 'delete',
                sort: 'asc',
                width: 100
            }
        ];
        let rows = [];
        axios.get(urlPort('/show'), {withCredentials: true})
            .then(
                res => {
                    this.setState({documents: res.data});
                    for (let i = 0; i < res.data.length; i++) {
                        rows.push({
                            id: res.data[i].id,
                            receiving_date: new Date(res.data[i].receivingDate).ddmmyyyy(),
                            info: res.data[i].info,
                            court: res.data[i].courtByCourtName.name,
                            judge: res.data[i].judgeName,
                            case_number: res.data[i].caseNumber,
                            plaintiff: res.data[i].plaintiff,
                            defendant: res.data[i].defendant,
                            execution_date: new Date(res.data[i].executionDate).ddmmyyyy(),
                            closing_number: res.data[i].closingNumber,
                            closing_date: res.data[i].closingDate === "" ? new Date(res.data[i].closingDate).ddmmyyyy() : "",
                            sending_date: res.data[i].sendingDate === "" ? new Date(res.data[i].sendingDate).ddmmyyyy() : "",
                            status: res.data[i].status,
                            delete: <MDBBtn color="crimson" onClick={this.edit()} rounded size="sm">Изменить</MDBBtn>,
                        })
                    }
                    let temp = {columns, rows};
                    this.setState({data: temp});
                }
            );
    }

    render() {
        return (
            <div className="MyTable">
                <MDBDataTable
                    striped
                    bordered
                    small
                    data={this.state.data}
                />
                <Button onClick={this.handleAdd} className="myButton">Добавить</Button>
            </div>
        );
    }
}