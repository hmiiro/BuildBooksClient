// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    CardBody,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory, {
    PaginationProvider,
    SizePerPageDropdownStandalone,
    PaginationTotalStandalone,
    PaginationListStandalone,
} from 'react-bootstrap-table2-paginator';
import classNames from 'classnames';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import PageTitle from '../../components/PageTitle';

//#region LOCAL IMPORTS
import { dateDDMMYYY } from '../../helpers/utils/format';
import { numberWithCommas } from '../../helpers/utils/format';

//#endregion
// BillTable
const BillTable = (mainProps) => {
    const customTotal = (from, to, size) => (
        <label className="react-bootstrap-table-pagination-total ml-2">
            Showing {from} to {to} of {size}
        </label>
    );

    const sizePerPageRenderer = ({ options, currSizePerPage, onSizePerPageChange }) => (
        <React.Fragment>
            <label className="d-inline mr-1">Display</label>
            <UncontrolledDropdown className="d-inline dropdown-sm">
                <DropdownToggle caret tag="button" type="button" className="btn btn-outline-secondary btn-sm">
                    {currSizePerPage}
                </DropdownToggle>
                <DropdownMenu>
                    {options.map((option, idx) => (
                        <DropdownItem
                            key={idx}
                            type="button"
                            className={classNames({ active: currSizePerPage + '' === option.page + '' })}
                            onClick={() => onSizePerPageChange(option.page)}>
                            {option.text}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </UncontrolledDropdown>
            <label className="d-inline ml-1">orders</label>
        </React.Fragment>
    );

    const { SearchBar } = Search;

    return (
        <PaginationProvider
            bootstrap4
            pagination={paginationFactory({
                ...mainProps.paginationOptions,
                paginationTotalRenderer: customTotal,
                custom: true,
                sizePerPageRenderer: sizePerPageRenderer,
            })}
            keyField="billNo"
            data={mainProps.data}
            columns={mainProps.columns}>
            {({ paginationProps, paginationTableProps }) => (
                <ToolkitProvider keyField="billNo" data={mainProps.data} columns={mainProps.columns} search>
                    {(props) => (
                        <React.Fragment>
                            <Row className="mt-2">
                                <Col md={12} sm={12}>
                                    <Form inline className="mb-2 float-right">
                                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                            <Label htmlFor="search" className="mr-sm-2">
                                                Search:
                                            </Label>
                                            <SearchBar {...props.searchProps} />
                                        </FormGroup>
                                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                            <Label htmlFor="status" className="mr-sm-2">
                                                Status:
                                            </Label>
                                            <Input type="select" name="select" id="status" className="custom-select">
                                                <option>Choose...</option>
                                                <option value="1">Paid</option>
                                                <option value="2">Awaiting Authorization</option>
                                                <option value="3">Payment failed</option>
                                                <option value="4">Cash On Delivery</option>
                                                <option value="5">Fulfilled</option>
                                                <option value="6">Unfulfilled</option>
                                            </Input>
                                        </FormGroup>
                                    </Form>
                                </Col>
                            </Row>

                            <BootstrapTable
                                {...props.baseProps}
                                bordered={true}
                                headerClasses="thead-light"
                                wrapperClasses="table-responsive"
                                {...paginationTableProps}
                            />
                            <Row>
                                <Col>
                                    <SizePerPageDropdownStandalone {...paginationProps} />

                                    <PaginationTotalStandalone {...paginationProps} dataSize={mainProps.data.length} />
                                </Col>
                                <Col className="react-bootstrap-table-pagination-list">
                                    <PaginationListStandalone {...paginationProps} />
                                </Col>
                            </Row>
                        </React.Fragment>
                    )}
                </ToolkitProvider>
            )}
        </PaginationProvider>
    );
};

// main component
function Bills() {
    //#region DATA FETCHING
    const { loading, data } = useQuery(FETCH_BILLS_QUERY);

    const bills = data && data.getBills;

    //#endregion

    //#region  custom column render
    const OrderColumn = (cell, row, rowIndex, extraData) => {
        return (
            <React.Fragment>
                <Link to={`/bills/${cell}`} className="text-body font-weight-bold">
                    {cell}
                </Link>
            </React.Fragment>
        );
    };

    const OrderDateColumn = (cell, row, rowIndex, extraData) => {
        return <React.Fragment>{dateDDMMYYY(cell)}</React.Fragment>;
    };

    const PaymentStatusColumn = (cell, row, rowIndex, extraData) => {
        return (
            <React.Fragment>
                <h5>
                    <span
                        className={classNames('badge', {
                            'badge-success-lighten': cell === 'Paid',
                            'badge-danger-lighten': cell === 'Payment Failed',
                            'badge-info-lighten': cell === 'Unpaid',
                            'badge-warning-lighten': cell === 'Awaiting Authorization',
                        })}>
                        {cell === 'Paid' && <i className="mdi mdi-coin mr-1" />}
                        {cell === 'Payment Failed' && <i className="mdi mdi-cancel mr-1" />}
                        {cell === 'Unpaid' && <i className="mdi mdi-cash mr-1" />}
                        {cell === 'Awaiting Authorization' && <i className="mdi mdi-timer-sand mr-1" />}
                        {cell}
                    </span>
                </h5>
            </React.Fragment>
        );
    };
    const AmountColumn = (cell, row, rowIndex, extraData) => {
        return <React.Fragment>{numberWithCommas(cell)}</React.Fragment>;
    };
    const StatusColumn = (cell, row, rowIndex, extraData) => {
        return (
            <React.Fragment>
                <h5>
                    <span
                        className={classNames('badge', {
                            'badge-success-lighten': cell === 'Delivered',
                            'badge-danger-lighten': cell === 'Cancelled',
                            'badge-info-lighten': cell === 'Shipped',
                            'badge-warning-lighten': cell === 'Processing',
                        })}>
                        {cell}
                    </span>
                </h5>
            </React.Fragment>
        );
    };

    const ActionColumn = (cell, row, rowIndex, extraData) => {
        return (
            <React.Fragment>
                <Link to="/" className="action-icon">
                    {' '}
                    <i className="mdi mdi-eye" />
                </Link>
                <Link to="/" className="action-icon">
                    {' '}
                    <i className="mdi mdi-square-edit-outline" />
                </Link>
                <Link to="/" className="action-icon">
                    {' '}
                    <i className="mdi mdi-delete" />
                </Link>
            </React.Fragment>
        );
    };
    //#endregion

    //#region Columns
    const columns = [
        {
            dataField: 'createdAt',
            text: 'Date',
            sort: true,
            formatter: OrderDateColumn,
        },
        {
            dataField: 'billNo',
            text: 'Bill No',
            sort: true,
            formatter: OrderColumn,
        },

        {
            dataField: 'supplier',
            text: 'Supplier',
            sort: true,
            formatter: PaymentStatusColumn,
        },
        {
            dataField: 'totAmt',
            text: 'Amount',
            sort: true,
            formatter: AmountColumn,
        },
        {
            dataField: 'totPaid',
            text: 'Paid',
            sort: true,
            formatter: AmountColumn,
        },
        {
            dataField: 'totBal',
            text: 'Balance',
            sort: true,
            formatter: AmountColumn,
        },
        {
            dataField: 'status',
            text: 'Status',
            sort: true,
            formatter: StatusColumn,
        },
    ];
    //#endregion

    const paginationOptions = {
        paginationSize: 5,
        pageStartIndex: 1,
        withFirstAndLast: false,
        showTotal: true,
        sizePerPageList: [
            {
                text: '10',
                value: 10,
            },
            {
                text: '20',
                value: 20,
            },
            {
                text: '50',
                value: 50,
            },
        ],
    };

    return (
        <React.Fragment>
            <PageTitle breadCrumbItems={[{ label: 'Bills', path: '/bills/', active: true }]} title={'Bills'} />

            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col sm={4}>
                                    <Link to={`/bills/createbill`}>
                                        <Button color="danger" className="mb-2">
                                            <i className="mdi mdi-plus-circle mr-2" /> New Bill
                                        </Button>
                                    </Link>
                                </Col>

                                <Col sm={8}>
                                    <div className="text-sm-right">
                                        <Button color="light" className="mb-2 mr-1">
                                            Export
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            {loading ? (
                                <p>Loading</p>
                            ) : (
                                <BillTable data={bills} columns={columns} paginationOptions={paginationOptions} />
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

const FETCH_BILLS_QUERY = gql`
    {
        getBills {
            createdAt
            billNo
            totItems
            totAmt
            totPaid
            totBal
            status
            supplier
        }
    }
`;

export default Bills;
