import gql from 'graphql-tag';

export const FETCH_BILLS_QUERY = gql`
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

export const FETCH_SINGLEBILL_QUERY = gql`
    query($id: String!) {
        getBill(billNo: $id) {
            createdAt
            billNo
            totItems
            totAmt
            totPaid
            totBal
            status
            user
            billItems {
                itemCode
                desc
                qty
                rate
            }
        }
    }
`;

export const FETCH_ITEMS_QUERY = gql`
    {
        getItems {
            itemCode
            name
            desc
            rate
        }
    }
`;

export const ADD_ITEM_MUTATION = gql`
    mutation createItem($name: String!, $desc: String, $qty: Int!, $rate: Int!) {
        createItem(input: { name: $name, desc: $desc, qty: $qty, rate: $rate }) {
            itemCode
            name
            rate
        }
    }
`;

export const ADD_BILL_MUTATION = gql`
    mutation createBill(
        $transDt: String!
        $supplier: String!
        $totItems: Int!
        $totAmt: Int!
        $totPaid: Int!
        $totBal: Int!
        $billItems: [BillItemInput]!
    ) {
        createBill(
            input: {
                transDt: $transDt
                supplier: $supplier
                totItems: $totItems
                totAmt: $totAmt
                totPaid: $totPaid
                totBal: $totBal
                billItems: $billItems
            }
        ) {
            transDt
            billNo
            supplier
            totAmt
            totPaid
            totBal
            status
            createdAt
        }
    }
`;
