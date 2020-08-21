import React, { useState,useCallback } from 'react';
import {Card, Tabs, DataTable,Link} from '@shopify/polaris';
import ProductList from './ProductList';
import TestProductList from './TestList';
import Sandbox from './sandbox';
import Products from './Products';
const TitleTab = () => {

  const [selected, setSelected] = useState(0);
   
    const handleTabChange = useCallback(
      (selectedTabIndex) => setSelected(selectedTabIndex),
      [selected],
    );
      
    const tabs = [
        {
        id: 'All',
        content: 'All',  
        accessibilityLabel: 'All',  
        panelID: 'All',  
        },  
        {  
        id: 'Sales',  
        content: 'Sales',  
        panelID: 'sales',  
        },    
    ];

    let tabSelected=null;
if (selected==0) {
  tabSelected=<ProductList/>
}
if (selected==1) {
  tabSelected=<TestProductList/>
}
console.log('tab renderig..');
return (
  <Card>
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      {tabSelected}
    </Tabs>
  </Card>
);  

}

export default TitleTab;