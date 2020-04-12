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
