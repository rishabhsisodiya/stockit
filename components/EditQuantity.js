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
    // const { loading, error, data } = useQuery(GET_INVENTORY_ITEM_BY_ID,{ variables: { id: props.variantId } });
    const { loading, error, data } = useQuery(GET_INVENTORY_LEVELS_BY_ID,{ variables: { id: props.inventoryId } });
    const [ addQuantity, {mloading,merror,mdata} ] = useMutation(UPDATE_QUANTITY);
    // const id=data.productVariant.inventoryItem.id;
    console.log('con..');
    const [value, setvalue] = useState('');
    const handleChange = useCallback(
        (newValue) => {
            setvalue(newValue);
        },
        [],
    )
    const updateHandler = () => {
      console.log('updatehandler',data.inventoryItem.inventoryLevels.edges[0].node.id);
      console.log('value:',value);
      addQuantity({ variables: { 
      inventoryAdjustQuantityInput: {
        inventoryLevelId:data.inventoryItem.inventoryLevels.edges[0].node.id,
        availableDelta:value
      } 
    } })
  };

  // if (loading) return <div>Loading...</div>
  if (merror) return <div>Error in mutatiton :{merror.message}</div>
  if (mdata) return <div>data {mdata}</div>
  // if (mdata) return <div>{mdata}</div>
    return (
        <div style={{display:"flex"}}>
            {/* {getInventoryLevel(data)} */}
            {/* {data.productVariant.inventoryItem.id} */}
            <TextField
              type="number"
              value={value}
              onChange={handleChange}
              placeholder="Add to available quantity"
              
            />
            <Button onClick={updateHandler}>Add</Button>
        </div>
    );

}

export default EditQuantity;