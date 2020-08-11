import React, { useState } from 'react';
import {Card, Tabs} from '@shopify/polaris';

const TitleTab = () => {
    const [selected, setSelected] = useState(0);
   
    const handleTabChange = () => {
       console.log("Worked");
    }
      
    const tabs = [
        {
        id: 'all-customers',
        content: 'All',  
        accessibilityLabel: 'All customers',  
        panelID: 'all-customers-content',  
        },  
        {  
        id: 'accepts-marketing',  
        content: 'Accepts marketing',  
        panelID: 'accepts-marketing-content',  
        },  
        {  
        id: 'repeat-customers',  
        content: 'Repeat customers',  
        panelID: 'repeat-customers-content',  
        },  
        {  
        id: 'prospects',  
        content: 'Prospects',  
        panelID: 'prospects-content',  
        },
    ];

return (
  <Card>
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Card.Section title={tabs[selected].content}>
            <p>Tab {selected} selected</p>
        </Card.Section>
    </Tabs>
  </Card>
);  

}

export default TitleTab;