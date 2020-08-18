import gql from 'graphql-tag';
import { useQuery} from '@apollo/react-hooks';
import { TextField, Button } from "@shopify/polaris";
import React, {useCallback, useState} from 'react';

const GET_INVENTORY_ITEM_BY_ID = gql`
query getVariantByID($id: ID!) {
    productVariant(id: $id) {
      id
      title
      inventoryItem {
        id
      }
    }
  }
`;

const EditQuantity = (props) => {
    const { loading, error, data } = useQuery(GET_INVENTORY_ITEM_BY_ID,{ variables: { id: props.variantId } });
    console.log(error);
    const [value, setvalue] = useState(props.quantity);
    const handleChange = useCallback(
        (newValue) => {
            setvalue(newValue);
        },
        [],
    )
    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>
    return (
        <div style={{display:"flex"}}> 
            <TextField
              type="number"
              value={value}
              onChange={handleChange}
            />
            <Button>Save</Button>
        </div>
    );

}

export default EditQuantity;