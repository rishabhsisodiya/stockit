import React, { useState,useCallback } from 'react';
import {Card, Tabs, DataTable} from '@shopify/polaris';
import Link from 'next/link';
const TitleTab = () => {

  const rows = [
    [
      <Link url="https://www.example.com" key="emerald-silk-gown">
        Emerald Silk Gown
      </Link>,
      '$875.00',
      124689,
      140,
      '$122,500.00',
    ],
    [
      <Link url="/products" key="mauve-cashmere-scarf">
        Mauve Cashmere Scarf
      </Link>,
      '$230.00',
      124533,
      83,
      '$19,090.00',
    ],
    [
      <Link url="/products" key="navy-merino-wool">
        Navy Merino Wool Blazer with khaki chinos and yellow belt
      </Link>,
      '$445.00',
      124518,
      32,
      '$14,240.00',
    ],
  ];

  const [selected, setSelected] = useState(0);
   
    const handleTabChange = useCallback(
      (selectedTabIndex) => setSelected(selectedTabIndex),
      [],
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
        {  
        id: 'Suit',  
        content: 'Suit',  
        panelID: 'Suit',  
        },  
    ];

return (
  <Card>
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Card.Section title={tabs[selected].content}>
          <p>Tab {selected} selected</p>
          <DataTable
          columnContentTypes={[
            'text',
            'numeric',
            'numeric',
            'numeric',
            'numeric',
          ]}
          headings={['Product', 'Price', 'SKU Number', 'Quantity', 'Net sales']}
          rows={rows}
        />
        </Card.Section>
    </Tabs>
  </Card>
);  

}

export default TitleTab;