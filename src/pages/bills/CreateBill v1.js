import React, { useState, Fragment, useContext } from 'react';
import { Row, Col, Card, CardBody, Alert } from 'reactstrap';
import { useMutation } from '@apollo/react-hooks';
import moment from 'moment';

import { numberWithCommas, dateDDMMYYY } from '../../helpers/utils/format';
import { statusColors } from '../../helpers/utils/status';
import { ADD_BILL_MUTATION } from '../../helpers/utils/graphql';
import LoadingSpinner from '../../helpers/utils/LoadingSpinner';
import PageTitle from '../../components/PageTitle';
import logoImg from '../../assets/images/logo-light.png';
import { useForm } from '../../helpers/utils/hooks';
import LineItems from './LineItems';

const CreateBill = (props) => {
    //#region LS
    // const { onChange, onSubmit, values } = useForm(creatingABill, {
    //     createdAt: moment(),
    //     supplier: '',
    //     billItems: [],
    //     totItems: 0,
    //     totAmt: 0,
    //     totPaid: 0,
    //     totBal: 0,
    // });

    //const { createdAt, supplier, totItems, totAmt, totPaid, totBal, billItems } = values;
    const [errors, setErrors] = useState([]);
    const [billItems, setBillItems] = useState([{ name: '', desc: '', qty: 1, rate: 0 }]);
    const [createdAt, setCreatedAt] = useState(moment());
    const [supplier, setSupplier] = useState('');
    const [totItems, setTotItems] = useState(0);
    const [totAmt, setTotAmt] = useState(0);
    const [totPaid, setTotPaid] = useState(0);
    const [totBal, setTotBal] = useState(0);

    //#region CL handlers and api hooks

    const [createBill, { loading }] = useMutation(ADD_BILL_MUTATION, {
        update(_, { data: { createBill: addedBill } }) {
            //context.login(addedBill);
            //props.history.push(`/bills/:${addedBill.billNo}`);
            console.log(addedBill);
        },
        onError(err) {
            setErrors([...errors], err.graphQLErrors[0].extensions.errors);
        },
        variables: { createdAt, supplier, totItems, totAmt, totPaid, totBal, billItems },
    });

    // function creatingABill() {
    //     createBill();
    // }
    //#endregion

    // handling functions
    //this handles invoice date changes.
    const onDateChange = (createdAt) => {
        // making sure the user doesnt clear the date with delete key
        if (createdAt) {
            setCreatedAt(() => ({ createdAt }));
        }
    };
    //this handles date focus.
    const onFocusChange = ({ focused }) => {
        setCreatedAt(() => ({ calenderFocused: focused }));
    };
    const onSupplierChange = (e) => {
        const supplier = e.target.value;
        setSupplier(() => ({ supplier }));
    };

    const handleLineItemChange = (elementIndex) => (e) => {
        console.log(elementIndex);
        console.log(e);
        let lineItems = billItems.map((item, i) => {
            if (elementIndex !== i) return item;

            const target = e.target;
            const value = target.type === 'change' ? target.selected : target.value;
            const name = target.name;

            return { ...item, [name]: value };
        });
        setBillItems({ lineItems });
    };

    const handleAddLineItem = (e) => {
        setBillItems([...billItems, { name: '', desc: '', qty: 1, rate: 0 }]);
    };

    const handleRemoveLineItem = (elementIndex) => (e) => {
        setBillItems({
            billItems: billItems.filter((item, i) => {
                return elementIndex !== i;
            }),
        });
    };

    const handleFocusSelect = (e) => {
        e.target.select();
    };

    // Remove Item from list
    const removeItem = (itemCode) => setBillItems([...billItems.slice(0, itemCode), ...billItems.slice(itemCode + 1)]);
    const calcLineItemsTotal = () => {
        return billItems.reduce((prev, cur) => prev + cur.qty * cur.rate, 0);
    };
    const handleSaveBill = (e) => {
        e.preventDefault();

        if (billItems.length <= 0 || calcLineItemsTotal() === 0) {
            // set error value
            setErrors([...errors], {
                error: 'Please add some items to the invoice!',
            });
        } else {
            // clear error value and set all summary amounts
            setErrors([{}]);
            setTotItems(billItems.length);
            setTotAmt(calcLineItemsTotal());
            setTotBal(totAmt - totPaid);
        }
        createBill();
    };
    return (
        <Fragment>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Bills', path: `/bills` },
                    { label: 'Create Bill', active: true },
                ]}
                title={'Bill'}
            />
            {errors.length > 0 && (
                <Alert color="danger" isOpen={errors ? true : false}>
                    <div>
                        <ul>
                            {errors.map((error) => Object.values(error).map((value) => <li key={value}>{value}</li>))}
                        </ul>
                    </div>
                </Alert>
            )}
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
                                <Col>
                                    <div className="table-responsive">
                                        <LineItems
                                            billItems={billItems}
                                            handleAdd={handleAddLineItem}
                                            handleChange={handleLineItemChange}
                                            handleFocus={handleFocusSelect}
                                            handleRemove={handleRemoveLineItem}
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <div className="clearfix pt-3">
                                        <h6 className="text-muted">Notes:</h6>
                                        <small>
                                            All accounts are to be paid within 7 days from receipt of invoice. To be
                                            paid by cheque or credit card or direct payment online. If account is not
                                            paid within 7 days the credits details supplied as confirmation of work
                                            undertaken will be charged the agreed quoted fee noted above.
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
                                        <h5>
                                            Amount Due:<span className="float-right">{totBal}</span>
                                        </h5>
                                    </div>
                                    <div className="clearfix"></div>
                                </Col>
                            </Row>

                            <div className="d-print-none mt-4">
                                <div className="text-left">
                                    <button className="btn btn-success" onClick={handleSaveBill}>
                                        <i className="mdi mdi-printer"></i> Save
                                    </button>
                                </div>
                                <div className="text-right">
                                    <button
                                        disabled
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
        </Fragment>
    );
};

export default CreateBill;
