import React, {PureComponent} from "react";
import "./index.css";
import {FormGroup, FormControl, Form, Button} from "react-bootstrap";
import axios from "axios";
import {urlPort} from "../../index";
import {DropdownButton} from "react-bootstrap";

import ReactTable from "react-table";
import "react-table/react-table.css";

Date.prototype.ddmmyyyy = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [(dd > 9 ? '' : '0') + dd, (mm > 9 ? '' : '0') + mm, this.getFullYear()].join('/');
};

export default class MyTable extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loaded: [],
            search: ""
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
        let temp = [];
        if (tag === "any") {
            temp = this.state.loaded;
        } else {
            for (let i = 0; i < this.state.loaded.length; i++) {
                if (this.state.loaded[i].color === tag) {
                    temp.push(this.state.loaded[i]);
                }
            }
        }
        this.setState({data: temp})
    };

    setRows = res => {
        let rows = [];
        for (let i = 0; i < res.data.length; i++) {
            let doc = res.data[i];
            let st = "white";
            if (doc.isExecuted)
                st = "#d4fa9b";
            else {
                if (new Date(doc.executionDate) - new Date() <= 604800000 && new Date(doc.executionDate) - new Date() >= 0)
                    st = "#fcbf44";
                else {
                    if (new Date(doc.executionDate) - new Date() < 0)
                        st = "#fc4444";
                }
            }
            rows.push({
                receiving_date: new Date(doc.receivingDate).ddmmyyyy(),
                court: doc.courtByCourtName.name,
                judge: doc.judgeName,
                plaintiff: doc.plaintiff,
                defendant: doc.defendant,
                execution_date: new Date(doc.executionDate).ddmmyyyy(),
                edit: <Button onClick={() => {
                    this.edit(doc)
                }}>Изменить</Button>,
                color: st
            })
        }
        return rows;
    };


    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
        let rows = [];
        let docs = this.state.loaded;
        let pattern = event.target.value;
        for (let i = 0; i < docs.length; i++) {
            if (
                docs[i].receiving_date.includes(pattern) ||
                docs[i].court.includes(pattern) ||
                docs[i].judge.includes(pattern) ||
                docs[i].plaintiff.includes(pattern) ||
                docs[i].defendant.includes(pattern) ||
                docs[i].execution_date.includes(pattern)
            )
                rows.push(docs[i]);
        }
        this.setState({data: rows})

    }

    componentDidMount() {
        let rows = [];
        axios.get(urlPort('/show'), {withCredentials: true})
            .then(
                res => {
                    rows = this.setRows(res);
                    this.setState({data: rows});
                    this.setState({loaded: rows});
                }
            );
    }

    getTrProps = (state, rowInfo, instance) => {
        if (rowInfo) {
            return {

                style: {
                    background: rowInfo.original.color,
                }
            }
        }
        return {};
    }

    render() {
        return (
            <div className="MyTable">

                <div className="row">
                    <div className="column left">
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
                    </div>
                    <div className="column right">

                        <FormGroup controlId="search" className="search-inp" bsSize="large">
                            <FormControl
                                placeholder="Найти"
                                type="text"
                                value={this.state.search}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                </div>


                <ReactTable
                    data={this.state.data}
                    columns={[
                        {
                            Header: 'Дата получения',
                            accessor: "receiving_date",
                            sortMethod: (a, b) => {
                                if (a === b) {
                                    return 0;
                                }
                                const aReverse = a.split("/").reverse().join("/");
                                const bReverse = b.split("/").reverse().join("/");
                                return aReverse > bReverse ? 1 : -1;
                            }
                        },
                        {
                            Header: 'Наименование суда',
                            accessor: "court",
                        }, {
                            Header: 'Судья (ФИО)',
                            accessor: "judge",
                        }, {
                            Header: "Истец",
                            accessor: "plaintiff",
                        }, {
                            Header: "Ответчик",
                            accessor: "defendant",
                        }, {
                            Header: "Дата исполнения",
                            accessor: "execution_date",
                            sortMethod: (a, b) => {
                                if (a === b) {
                                    return 0;
                                }
                                const aReverse = a.split("/").reverse().join("/");
                                const bReverse = b.split("/").reverse().join("/");
                                return aReverse > bReverse ? 1 : -1;
                            }
                        }, {
                            Header: "Изменить",
                            accessor: "edit",
                        },
                    ]}
                    getTrProps={this.getTrProps}
                    defaultPageSize={10}
                    className=" -highlight"

                />
                <Button onClick={this.handleAdd} className="myButton">Добавить</Button>
            </div>
        );
    }
}