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

export const ADD_BILL_MUTATION = gql`
    mutation createBill(
        # $createdAt: String!
        $supplier: String!
        $totItems: Int!
        $totAmt: Int!
        $totPaid: Int!
        $totBal: Int!
        $billItems: [BillItemInput]!
    ) {
        createBill(
            input: {
                # createdAt: $createdAt
                supplier: $supplier
                totItems: $totItems
                totAmt: $totAmt
                totPaid: $totPaid
                totBal: $totBal
                billItems: $billItems
            }
        ) {
            createdAt
            billNo
        }
    }
`;
