import React from 'react';

import { Button, Input, Table } from 'reactstrap';

import LoadingSpinner from '../../helpers/utils/LoadingSpinner';

//#region ItemRow
function ItemRow(props) {
    console.log(props);
    const { index, item, handleChange, handleRemove, handleFocus } = props;
    const { name, desc, qty, rate } = item;
    return (
        <React.Fragment>
            <tr>
                <td>{index + 1}</td>
                <td>
                    <Input
                        bsSize="sm"
                        placeholder="Item Name"
                        value={name}
                        onFocus={handleFocus}
                        onChange={handleChange(index)}
                    />
                </td>
                <td>
                    <Input
                        bsSize="sm"
                        placeholder="Description"
                        value={desc}
                        onFocus={handleFocus}
                        onChange={handleChange(index)}
                    />
                </td>
                <td>
                    <Input
                        bsSize="sm"
                        placeholder="Qty"
                        value={qty}
                        onFocus={handleFocus}
                        onChange={handleChange(index)}
                    />
                </td>
                <td>
                    <Input
                        bsSize="sm"
                        placeholder="Rate"
                        value={rate}
                        onFocus={handleFocus}
                        onChange={handleChange(index)}
                    />
                </td>
                <td className="text-center align-middle">
                    <Input bsSize="sm" disabled value={qty * rate} />
                </td>
                <td className="text-center align-middle">
                    <Button color="danger" size="sm" onClick={handleRemove(index)}>
                        x
                    </Button>
                </td>
            </tr>
        </React.Fragment>
    );
}
//#endregion

const LineItems = (props) => {
    const { billItems, handleAdd, ...functions } = props;
    return (
        <React.Fragment>
            <Table bordered className="table mt-4">
                <thead>
                    <tr className="fs--1">
                        <th>#</th>
                        <th>Item Name</th>
                        <th>Desc</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Amount</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {billItems.map((item, i) => (
                        <ItemRow item={item} index={i} key={i} {...functions} />
                    ))}
                </tbody>
            </Table>
            <Button color="success" size="sm" icon="plus" onClick={handleAdd}>
                Add Item
            </Button>
        </React.Fragment>
    );
};

export default LineItems;
