import React, { useState } from 'react';
import Select from 'react-select';
import { Button, Card, CardBody, Input, Table, Row, Col } from 'reactstrap';
//import DatePicker from 'react-datepicker';

import { isIterableArray } from '../../helpers/utils/format';
import PageTitle from '../../components/PageTitle';
import { numberWithCommas, dateDDMMYYY } from '../../helpers/utils/format';

import HyperDatepicker from '../../components/Datepicker';

//#region Item Row
const ItemRow = ({ id, name, desc, rate, qty, handleChange, handleRemove, handleFocus }) => (
    <tr>
        <td>{id + 1}</td>
        <td>
            <Input
                bsSize="sm"
                required
                value={name}
                placeholder="Enter item name"
                onChange={({ target }) => handleChange(id, 'name', target.value)}
                onFocus={handleFocus}
            />
        </td>

        <td>
            <Input bsSize="sm" value={desc} onChange={({ target }) => handleChange(id, 'desc', target.value)} />
        </td>
        <td>
            <Input
                bsSize="sm"
                required
                value={qty}
                onFocus={handleFocus}
                onChange={({ target }) => handleChange(id, 'qty', target.value)}
            />
        </td>
        <td>
            <Input
                bsSize="sm"
                required
                onFocus={handleFocus}
                value={numberWithCommas(rate)}
                onChange={({ target }) => handleChange(id, 'rate', target.value)}
            />
        </td>
        <td>{numberWithCommas(qty * rate)}</td>
        {/* <td className="text-center align-middle">
            <CustomInput
                type="radio"
                id={`itemPrice${id}`}
                name="itemPriceRadio"
                checked={checked}
                onChange={({ target }) => handleChange(id, 'checked', target.checked)}
            />
        </td> */}
        <td className="text-center align-middle">
            <Button color="danger" size="sm" onClick={() => handleRemove(id)}>
                x
            </Button>
        </td>
    </tr>
);
//#endregion

//#region Bill Header
const BillHeader = ({ suppliers, totAmt, totPaid, totBal }) => {
    return (
        <Card>
            <CardBody>
                <h4 className="header-title text-info">Bill Details:</h4>
                <hr className="header-title text-info" />
                <Row>
                    <Col sm={3}>
                        <h5>Bill Date:</h5>
                        <HyperDatepicker hideAddon={true} />
                        <br />
                        <h5>Supplier Details:</h5>
                        <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            options={suppliers}
                            required={true}></Select>
                    </Col>
                    <Col sm={3}>
                        <h5>Order Date:</h5>
                        <HyperDatepicker hideAddon={true} />
                        <br />
                        <h5>Payment Terms:</h5>
                        <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            options={[
                                { value: 'cash', label: 'Cash On Delivery' },
                                { value: '7Days', label: '7 Days' },
                                { value: '14Days', label: '14 Days' },
                                { value: '30Days', label: '30 Days' },
                            ]}></Select>
                    </Col>
                    <Col sm={3}>
                        <div></div>
                    </Col>

                    <Col sm={3}>
                        <div className="mt-3 float-sm-right">
                            <h5 className="header-title text-info">Bill Summary:</h5>
                            <div className="table-responsive">
                                <Table size="sm" bordered striped>
                                    <tbody>
                                        <tr>
                                            <th className="text-sm-right">Total:</th>
                                            <td>{numberWithCommas(totAmt)}</td>
                                        </tr>
                                        <tr>
                                            <th className="text-sm-right">Paid:</th>
                                            <td>{numberWithCommas(totPaid)}</td>
                                        </tr>
                                        <tr>
                                            <th className="text-sm-right text-danger">Bal:</th>
                                            <td className="text-danger">{numberWithCommas(totBal)}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};
//#endregion

//#region Main Component
const CreateBill = () => {
    // Data and State
    const [items, setItems] = useState([{ name: '', desc: '', qty: 1, rate: 0 }]);
    const [totPaid, setTotPaid] = useState(0);
    const [suppliers, setSuppliers] = useState([{ value: 'General', label: 'General' }]);
    const [notes, setNotes] = useState('All accounts are to be paid within 30 days from recording of bill.');
    const calcLineItemsTotal = () => {
        return items.reduce((prev, cur) => prev + cur.qty * cur.rate, 0);
    };
    const totAmt = calcLineItemsTotal();
    const totBal = totAmt - totPaid;
    // Change Item
    const changeItem = (id, name, value) => {
        const updatedItems = name === 'checked' ? items.map((item) => ({ ...item, checked: false })) : [...items];
        const updatedItem = { ...items[id], [name]: value };

        setItems([...updatedItems.slice(0, id), updatedItem, ...updatedItems.slice(id + 1)]);
    };

    // Remove Item
    const removeItem = (id) => setItems([...items.slice(0, id), ...items.slice(id + 1)]);

    // focus on select
    const handleFocus = (e) => {
        e.target.select();
    };
    return (
        <React.Fragment>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Bills', path: `/bills` },
                    { label: 'Create Bill', active: true },
                ]}
                title={'New Bill'}
            />
            <BillHeader suppliers={suppliers} totAmt={totAmt} totPaid={totPaid} totBal={totBal} />
            <Card className="mb-3">
                <CardBody>
                    <h4 className="header-title text-info">Item Details:</h4>
                    <Table bordered className="mb-0" responsive>
                        <thead>
                            <tr className="thead-light">
                                <th>#</th>
                                <th>Item Name</th>
                                <th>Desc</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th className="text-right">Amount</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {isIterableArray(items) &&
                                items.map((item, index) => (
                                    <ItemRow
                                        {...item}
                                        id={index}
                                        handleChange={changeItem}
                                        handleRemove={removeItem}
                                        handleFocus={handleFocus}
                                        key={index}
                                    />
                                ))}
                        </tbody>
                    </Table>
                    <Button
                        color="success"
                        size="sm"
                        onClick={() => setItems([...items, { name: '', desc: '', qty: 1, rate: 0 }])}>
                        Add New
                    </Button>
                </CardBody>
            </Card>
            <Row>
                <Col sm={6}>
                    <div className="clearfix pt-3">
                        <h6 className="text-muted">Notes:</h6>
                        <Input
                            type="textarea"
                            name="text"
                            value={notes}
                            onChange={({ target }) => setNotes(target.value)}
                            rows="3"
                        />
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="float-right mt-3 mt-sm-0">
                        <p>
                            <b>Total Amount:</b> <span className="float-right">{numberWithCommas(totAmt)}</span>
                        </p>
                        <p>
                            <b>Amount Paid:</b> <span className="float-right">{numberWithCommas(totPaid)}</span>
                        </p>
                        <h5 className="text-danger">
                            Amount Due:<span className="float-right">{numberWithCommas(totBal)}</span>
                        </h5>
                    </div>
                    <div className="clearfix"></div>
                </Col>
            </Row>
        </React.Fragment>
    );
};
//#endregion
export default CreateBill;
