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
      
    let tabs = [
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
console.log(tabs);
    const customSearchHandler = useCallback(
      () => {
        tabs.push({  
          id: 'CustomSearch',  
          content: 'CustomSearch', 
          accessibilityLabel: 'CustomSearch', 
          panelID: 'CustomSearch',  
          })
         let newTabIndex = tabs.length-1;
         console.log(tabs);
         setSelected(newTabIndex); 
      },
      [tabs],
    )
    const removeCustomSearch =useCallback(
      () => {
        tabs.pop()
      },
      [tabs],
    )

    let tabSelected;
if (selected==0) {
  tabSelected=<Sandbox customSearch={customSearchHandler} removeCustomSearch={removeCustomSearch}/>
}
if (selected==1) {
  tabSelected=<TestProductList/>
}
if (selected==2) {
  tabSelected=<ProductList/>
}else{
  tabSelected=<Sandbox customSearch={customSearchHandler} removeCustomSearch={removeCustomSearch}/>
}
console.log('tab rendering..');
return (
  <Card>
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      {tabSelected}
    </Tabs>
  </Card>
);  

}

export default TitleTab;