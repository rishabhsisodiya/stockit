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
        id: 'Dev',
        content: 'Dev',  
        accessibilityLabel: 'Dev',  
        panelID: 'Dev',  
        },  
        {  
        id: 'Pre-Prod',  
        content: 'Pre-Prod',
        accessibilityLabel: 'Pre-Prod',  
        panelID: 'Pre-Prod',  
        }, 
        {  
        id: 'Prod',  
        content: 'Prod', 
        accessibilityLabel: 'Prod', 
        panelID: 'Prod',  
        },   
    ];

    let tabSelected=null;
if (selected==0) {
  // tabSelected=<ProductList/>
  tabSelected=<Sandbox/>
}
if (selected==1) {
  tabSelected=<TestProductList/>
}
if (selected==2) {
  tabSelected=<ProductList/>
  // tabSelected=<Sandbox/>
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