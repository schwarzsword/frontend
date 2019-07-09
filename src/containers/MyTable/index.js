import React, {PureComponent} from "react";
import "./index.css";
import {Button} from "react-bootstrap";
import {MDBDataTable, MDBBtn} from 'mdbreact';
import axios from "axios";
import {urlPort} from "../../index";
import {DropdownButton} from "react-bootstrap";

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
                rows: []
            },
            colors: [],
            loaded: null
        };
    }

    edit = doc => {
        this.props.setEditing(doc);
        let history = this.props.history;
        history.push('/edit');
    };

    handleAdd = event => {
        this.props.setEditing(null);
        let history = this.props.history;
        history.push('/edit');
    };

    showFiltered = tag => {
        let list = document.getElementsByTagName("tr");
        for (let i = 1; i < list.length - 1; i++) {
            list[i].style.display = "none";
        }
        if (tag === "any") {
            for (let i = 1; i < list.length - 1; i++) {
                list[i].style.display = "";
            }
        } else {
            let list2 = document.getElementsByClassName(tag);
            for (let i = 0; i < list2.length; i++) {
                list2[i].style.display = "";
            }
        }
    };

    setRows = res => {
        let rows = [];
        for (let i = 0; i < res.data.length; i++) {
            let doc = res.data[i];
            let st = "common";
            if (doc.isExecuted)
                st = "green";
            else {
                if (new Date(new Date(doc.executionDate) - new Date()).getDate() <= 7)
                    st = "red";
                else {
                    if (new Date(doc.executionDate) - new Date() <= 0)
                        st = "dated";
                }
            }
            this.state.colors.push(st);
            rows.push({
                receiving_date: new Date(doc.receivingDate).ddmmyyyy(),
                court: doc.courtByCourtName.name,
                judge: doc.judgeName,
                plaintiff: doc.plaintiff,
                defendant: doc.defendant,
                execution_date: new Date(doc.executionDate).ddmmyyyy(),
                edit: <MDBBtn color="crimson" onClick={() => {
                    this.edit(doc)
                }} rounded size="sm">Изменить</MDBBtn>,
            })
        }
        return rows;
    };


    componentDidMount() {
        let columns = [
            {
                label: 'Дата получения',
                field: 'receiving_date',
                width: 50
            },
            {
                label: 'Наименование суда',
                field: 'court',
                width: 150
            },
            {
                label: 'Судья (ФИО)',
                field: 'judge',
                width: 150
            },
            {
                label: 'Истец',
                field: 'plaintiff',
                width: 100
            },
            {
                label: 'Ответчик',
                field: 'defendant',
                width: 100
            },
            {
                label: 'Дата исполнения',
                field: 'execution_date',
                width: 100
            },
            {
                label: 'Изменение',
                field: 'edit',
                width: 100
            },
        ];
        let rows = [];
        axios.get(urlPort('/show'), {withCredentials: true})
            .then(
                res => {
                    rows = this.setRows(res);
                    let temp = {columns, rows};
                    this.setState({data: temp});
                    let list = document.getElementsByTagName("tr");
                    for (let i = 0; i < this.state.colors.length; i++) {
                        list[i + 1].className = this.state.colors[i];
                    }
                }
            );
    }

    render() {
        return (
            <div className="MyTable">
                <DropdownButton id="dropdown-basic-button" title="Фильтр">
                    <div className="droplist" onClick={() => {
                        this.showFiltered("any")
                    }}>Показать все
                    </div>
                    <div className="droplist" onClick={() => {
                        this.showFiltered("red")
                    }}>Показать срочные
                    </div>
                    <div className="droplist" onClick={() => {
                        this.showFiltered("common")
                    }}>Показать несрочные
                    </div>
                    <div className="droplist" onClick={() => {
                        this.showFiltered("dated")
                    }}>Показать просроченные
                    </div>
                    <div className="droplist" onClick={() => {
                        this.showFiltered("green")
                    }}>Показать исполненные
                    </div>
                </DropdownButton>
                <MDBDataTable
                    bordered
                    data={this.state.data}
                    sorting={false}
                />
                <Button onClick={this.handleAdd} className="myButton">Добавить</Button>
            </div>
        );
    }
}