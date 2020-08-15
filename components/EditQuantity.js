import { TextField, Button } from "@shopify/polaris";
import React, {useCallback, useState} from 'react';

const EditQuantity = () => {
    const [value, setvalue] = useState(props.quantity);
    const handleChange = useCallback(
        (newValue) => {
            setvalue(newValue);
        },
        [],
    )

    return (
        <div>
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