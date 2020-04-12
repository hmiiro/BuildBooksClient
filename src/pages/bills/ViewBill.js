import React, { useState, Fragment, useContext } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';

import { numberWithCommas, dateDDMMYYY } from '../../helpers/utils/format';
import { statusColors } from '../../helpers/utils/status';
import { FETCH_SINGLEBILL_QUERY } from '../../helpers/utils/graphql';
import LoadingSpinner from '../../helpers/utils/LoadingSpinner';
import PageTitle from '../../components/PageTitle';
import logoImg from '../../assets/images/logo-light.png';
import orderBarcodeImg from '../../assets/images/barcode.png';

const ViewBill = (props) => {
    const billdata = {
        notes:
            'Please find below a cost-breakdown for the recent work completed. Please make payment at your earliest convenience, and do not hesitate to contact me with any questions.',
        order_date: 'Jan 17, 2018',
        order_status: 'Paid',
        order_id: '123456',
        order_barcode: orderBarcodeImg,
        billing_address: {
            line_1: 'Lynne K. Higby',
            line_2: '795 Folsom Ave, Suite 600',
            city: 'San Francisco',
            state: 'CA',
            zip: 94107,
            phone: '(123) 456-7890',
        },
        shipping_address: {
            line_1: 'Cooper Hobson',
            line_2: '795 Folsom Ave, Suite 600',
            city: 'San Francisco',
            state: 'CA',
            zip: 94107,
            phone: '(123) 456-7890',
        },
    };

    const id = props.match.params.id;
    console.log(id);
    const { loading, data } = useQuery(FETCH_SINGLEBILL_QUERY, {
        variables: {
            id,
        },
    });
    console.log(data);
    const { billNo, createdAt, totItems, totAmt, totPaid, totBal, status, supplier, billItems } =
        !loading && data.getBill;
    return (
        <Fragment>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Bills', path: `/bills` },
                    { label: `${id}`, active: true },
                ]}
                title={'Bill'}
            />
            {loading ? (
                <LoadingSpinner />
            ) : (
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <div className="clearfix">
                                    <div className="float-left mb-3">
                                        <img src={logoImg} alt="logo" height="18" />
                                    </div>
                                    <div className="float-right">
                                        <h4 className="m-0 d-print-none">Supplier Bill</h4>
                                    </div>
                                </div>

                                <Row>
                                    <Col sm={6}>
                                        <div className="float-left mt-3">
                                            <p>
                                                <b>Hello, {supplier}</b>
                                            </p>
                                            <p className="text-muted font-13">{billdata.notes}</p>
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="mt-3 float-sm-right">
                                            <p className="font-13">
                                                <strong>Order Date: </strong> &nbsp;&nbsp;&nbsp; {billdata.order_date}
                                            </p>
                                            <p className="font-13">
                                                <strong>Order Status: </strong>{' '}
                                                <span className="badge badge-success float-right">
                                                    {billdata.order_status}
                                                </span>
                                            </p>
                                            <p className="font-13">
                                                <strong>Order ID: </strong>{' '}
                                                <span className="float-right">#{billdata.order_id}</span>
                                            </p>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="mt-4">
                                    <Col sm={4}>
                                        <h6>Billing Address</h6>
                                        <address>
                                            {billdata.billing_address.line_1}
                                            <br />
                                            {billdata.billing_address.line_2}
                                            <br />
                                            {billdata.billing_address.city}, {billdata.billing_address.state}{' '}
                                            {billdata.billing_address.zip}
                                            <br />
                                            <abbr title="Phone">P:</abbr> {billdata.billing_address.phone}
                                        </address>
                                    </Col>
                                    <Col sm={4}>
                                        <h6>Shipping Address</h6>
                                        <address>
                                            {billdata.shipping_address.line_1}
                                            <br />
                                            {billdata.shipping_address.line_2}
                                            <br />
                                            {billdata.shipping_address.city}, {billdata.shipping_address.state}{' '}
                                            {billdata.shipping_address.zip}
                                            <br />
                                            <abbr title="Phone">P:</abbr> {billdata.shipping_address.phone}
                                        </address>
                                    </Col>
                                    <Col sm={4}>
                                        <div className="text-sm-right">
                                            <img src={billdata.order_barcode} alt="" className="img-fluid mr-2" />
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <div className="table-responsive">
                                            <table className="table mt-4">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Item</th>
                                                        <th>Quantity</th>
                                                        <th>Unit Cost</th>
                                                        <th className="text-right">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {billItems.map((item, idx) => {
                                                        return (
                                                            <tr key={item.itemCode}>
                                                                <td>{idx + 1}</td>
                                                                <td>
                                                                    <b>{item.desc}</b> <br />
                                                                    {item.desc}
                                                                </td>
                                                                <td>{item.qty}</td>
                                                                <td>{item.rate}</td>
                                                                <td className="text-right">{item.qty * item.rate}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col sm={6}>
                                        <div className="clearfix pt-3">
                                            <h6 className="text-muted">Notes:</h6>
                                            <small>
                                                All accounts are to be paid within 7 days from receipt of invoice. To be
                                                paid by cheque or credit card or direct payment online. If account is
                                                not paid within 7 days the credits details supplied as confirmation of
                                                work undertaken will be charged the agreed quoted fee noted above.
                                            </small>
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="float-right mt-3 mt-sm-0">
                                            <p>
                                                <b>Total Amount:</b> <span className="float-right">{totAmt}</span>
                                            </p>
                                            <p>
                                                <b>Amount Paid:</b> <span className="float-right">`({totPaid})`</span>
                                            </p>
                                            <h3>
                                                Amount Due:<span className="float-right">{totBal}</span>
                                            </h3>
                                        </div>
                                        <div className="clearfix"></div>
                                    </Col>
                                </Row>

                                <div className="d-print-none mt-4">
                                    <div className="text-right">
                                        <button
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                                window.print();
                                            }}>
                                            <i className="mdi mdi-printer"></i> Print
                                        </button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}
        </Fragment>
    );
};

export default ViewBill;
