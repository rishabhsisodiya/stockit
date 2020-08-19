import gql from 'graphql-tag';
import { useQuery,useMutation} from '@apollo/react-hooks';
import { TextField, Button } from "@shopify/polaris";
import React, {useCallback, useState} from 'react';

const GET_INVENTORY_LEVELS_BY_ID = gql`
query getInventoryItemByID($id: ID!) {
    inventoryItem(id: $id) {
      id
      inventoryLevels (first:1) {
        edges {
          node {
            id
            available
          }
        }
      }
    }
  }
`;

const UPDATE_QUANTITY = gql`
mutation adjustInventoryLevelQuantity($inventoryAdjustQuantityInput: InventoryAdjustQuantityInput!) {
  inventoryAdjustQuantity(input: $inventoryAdjustQuantityInput) {
    inventoryLevel {
      available
    }
    userErrors {
      field
      message
    }
  }
}
`;

const EditQuantity = (props) => {
  console.log('Edit rendering');
    // const { loading, error, data } = useQuery(GET_INVENTORY_ITEM_BY_ID,{ variables: { id: props.variantId } });
    const { loading, error, data } = useQuery(GET_INVENTORY_LEVELS_BY_ID,{ variables: { id: props.inventoryId } });
    const [ addQuantity, {mloading,merror,mdata} ] = useMutation(UPDATE_QUANTITY);
    // const id=data.productVariant.inventoryItem.id;
    const [value, setvalue] = useState('');
    const handleChange = useCallback(
        (newValue) => {
            setvalue(newValue);
        },
        [],
    )
    const updateHandler = () => {
      addQuantity({ variables: { 
      inventoryAdjustQuantityInput: {
        inventoryLevelId:data.inventoryItem.inventoryLevels.edges[0].node.id,
        availableDelta:parseInt(value)
      } 
    } })
    setvalue('');
    props.callback();
  };
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
    return (
        <div style={{display:"flex"}}>
            <TextField
              type="number"
              value={value}
              onChange={handleChange}
              placeholder="Add to available quantity"
            />
            <Button onClick={updateHandler} primary>Add</Button>
        </div>
    );

}

export default EditQuantity;