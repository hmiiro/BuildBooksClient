import React, { useState, useContext, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button, Card, CardBody, Input, Table, Row, Col } from 'reactstrap';
import DatePicker from 'react-datepicker';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { isIterableArray } from '../../helpers/utils/format';
import PageTitle from '../../components/PageTitle';
import { numberWithCommas } from '../../helpers/utils/format';
import LoaderWidget from '../../components/Loader';

import { FETCH_ITEMS_QUERY } from '../../helpers/utils/graphql';

//#region Item Row
const ItemRow = ({
    id,
    name,
    desc,
    rate,
    qty,
    handleChange,
    handleRemove,
    handleFocus,
    isLoading,
    handleCreateItem,
    items,
}) => (
    <Row>
        <Col sm={1}>{id + 1}</Col>
        <Col sm={2}>
            <CreatableSelect
                isClearable={true}
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={(newValue) => handleChange(id, 'name', newValue)}
                onCreateOption={handleCreateItem}
                options={items}
                value={name}
                required={true}
                onFocus={handleFocus}
            />
        </Col>
        <Col sm={2}>
            <Input bsSize="sm" value={desc} onChange={({ target }) => handleChange(id, 'desc', target.value)} />
        </Col>
        <Col sm={2}>
            <Input
                bsSize="sm"
                required
                value={qty}
                type="number"
                onFocus={handleFocus}
                onChange={({ target }) => handleChange(id, 'qty', target.value)}
            />
        </Col>
        <Col sm={2}>
            <Input
                bsSize="sm"
                required
                onFocus={handleFocus}
                type="number"
                value={rate}
                onChange={({ target }) => handleChange(id, 'rate', target.value)}
            />
        </Col>
        <Col sm={2} className="text-right">
            {numberWithCommas(qty * rate)}
        </Col>
        <Col sm={1} className="text-center align-middle">
            <Button color="danger" size="sm" onClick={() => handleRemove(id)}>
                x
            </Button>
        </Col>
    </Row>
);
//#endregion

//#region Bill Header
const BillHeader = ({
    suppliers,
    totAmt,
    totPaid,
    totBal,
    startDate,
    handleDate,
    handleSupplierChange,
    handleCreateSupplier,
    selectedOption,
    isLoading,
}) => {
    return (
        <Card>
            <CardBody>
                <h4 className="header-title text-info">Bill Details:</h4>
                <hr className="header-title text-info" />
                <Row>
                    <Col sm={3}>
                        <h5>Bill Date:</h5>
                        <DatePicker
                            selected={startDate}
                            onChange={handleDate}
                            className="form-control date"
                            id="dash-daterange"
                            dateFormat="dd/MM/yyyy"
                        />
                        <br />
                        <h5>Order Date:</h5>
                        <DatePicker
                            selected={startDate}
                            onChange={handleDate}
                            className="form-control date"
                            id="dash-daterange"
                            dateFormat="dd/MM/yyyy"
                        />
                    </Col>
                    <Col sm={3}>
                        <h5>Supplier Details:</h5>
                        <CreatableSelect
                            isClearable={true}
                            isDisabled={isLoading}
                            isLoading={isLoading}
                            onChange={handleSupplierChange}
                            onCreateOption={handleCreateSupplier}
                            options={suppliers}
                            value={selectedOption}
                            required={true}
                        />

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
                    <Col sm={3}></Col>

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
const CreateBill = (props) => {
    //#region DATA FETCHING AND CREATING
    const { loading, data } = useQuery(FETCH_ITEMS_QUERY);

    const RecievedItems = data && data.getItems;

    //#endregion

    // Data and State
    const [startDate, setStartDate] = useState(new Date());
    const [billItems, setBillItems] = useState([]);
    const [totPaid, setTotPaid] = useState(0);
    const [notes, setNotes] = useState('All accounts are to be paid within 30 days from recording of bill.');
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([{ label: 'General', value: 'General' }]);
    const [selectedItem, setSelectedItem] = useState(undefined);
    const [suppliers, setSuppliers] = useState([{ label: 'General', value: 'General' }]);
    const [selectedOption, setSelectedOption] = useState(undefined);
    const [errors, setErrors] = useState({});

    const calcLineItemsTotal = () => {
        return billItems.reduce((prev, cur) => prev + cur.qty * cur.rate, 0);
    };
    const totAmt = calcLineItemsTotal();
    const totBal = totAmt - totPaid;
    // Change Item
    const changeItem = (id, name, value) => {
        const updatedItems = [...billItems];

        const updatedItem = { ...billItems[id], [name]: value };

        setBillItems([...updatedItems.slice(0, id), updatedItem, ...updatedItems.slice(id + 1)]);
    };

    // Remove Item
    const removeItem = (id) => setBillItems([...billItems.slice(0, id), ...billItems.slice(id + 1)]);

    // focus on select
    const handleFocus = (e) => {
        e.target.select();
    };
    //#region Bill Options handlers
    const handleDate = (date) => {
        setStartDate(date);
    };
    const createOption = (label) => ({
        label,
        value: label.replace(/\W/g, ''),
    });
    const handleSupplierChange = (newValue, actionMeta) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
        setSelectedOption(newValue);
    };
    const handleCreateSupplier = (inputValue) => {
        setIsLoading(true);
        console.group('Option created');
        console.log('Wait a moment...');
        setTimeout(() => {
            console.log(suppliers);
            const newOption = createOption(inputValue);
            console.log(newOption);
            console.groupEnd();
            setSuppliers([newOption, ...suppliers]);
            setIsLoading(false);
            setSelectedOption(newOption);
        }, 1000);
        console.log(suppliers);
    };

    const handleItemChange = (newValue) => {
        setSelectedItem(newValue);
    };
    const handleCreateItem = (inputValue) => {
        setIsLoading(true);
        console.group('Item created');
        console.log('Wait a moment...');
        setTimeout(() => {
            console.log(suppliers);
            const newOption = createOption(inputValue);
            console.log(newOption);
            console.groupEnd();
            setItems([newOption, ...items]);
            setIsLoading(false);
            setSelectedItem(newOption);
        }, 1000);
        console.log(items);
    };
    //#endregion
    return (
        <React.Fragment>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Bills', path: `/bills` },
                    { label: 'Create Bill', active: true },
                ]}
                title={'New Bill'}
            />
            <BillHeader
                suppliers={suppliers}
                isLoading={isLoading}
                handleSupplierChange={handleSupplierChange}
                handleCreateSupplier={handleCreateSupplier}
                selectedOption={selectedOption}
                totAmt={totAmt}
                totPaid={totPaid}
                totBal={totBal}
                startDate={startDate}
                handleDate={handleDate}
            />
            <Card className="mb-3">
                <CardBody>
                    <h4 className="header-title text-info">Item Details:</h4>
                    <div>
                        {/* <hr className="header-title text-info" /> */}
                        <Row className="bg-info">
                            <Col sm={1}>
                                <h5 className="text-light text-left">#</h5>
                            </Col>
                            <Col sm={2}>
                                <h5 className="text-light text-left">Item Name:</h5>
                            </Col>
                            <Col sm={2}>
                                <h5 className="text-light text-left">Description:</h5>
                            </Col>
                            <Col sm={2}>
                                <h5 className="text-light text-left">Qty:</h5>
                            </Col>
                            <Col sm={2}>
                                <h5 className="text-light text-left">Rate:</h5>
                            </Col>
                            <Col sm={2}>
                                <h5 className="text-light text-right">Amount:</h5>
                            </Col>
                            <Col sm={1}>
                                <h6 className="text-light text-right">Action</h6>
                            </Col>
                        </Row>
                        <hr className="header-title text-info" />
                        {isIterableArray(billItems) &&
                            billItems.map((item, index) => (
                                // <React.Fragment key={index}>
                                <ItemRow
                                    {...item}
                                    id={index}
                                    handleChange={changeItem}
                                    handleRemove={removeItem}
                                    handleFocus={handleFocus}
                                    isLoading={isLoading}
                                    handleItemChange={handleItemChange}
                                    handleCreateItem={handleCreateItem}
                                    selectedItem={selectedItem}
                                    items={items}
                                    key={index}
                                />

                                // </React.Fragment>
                            ))}
                    </div>

                    <Button
                        color="success"
                        size="sm"
                        onClick={
                            (console.log(billItems),
                            () => setBillItems([...billItems, { name: '', desc: '', qty: 1, rate: 0 }]))
                        }>
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
