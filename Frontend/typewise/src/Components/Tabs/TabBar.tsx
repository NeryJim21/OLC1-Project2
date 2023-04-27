import React, { useState } from 'react'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import CodeEditor from '../Code/CodeEditor'

import 'react-tabs/style/react-tabs.css'
import './TabBar.css'


const TabBar = () => {
    const [ban, setBan] = useState(false)
    const [tabs, setTabs] = useState([<Tab>New Tab<button className="Button" onClick={hanldleClose}>×</button></Tab>])
    const [panels, setPanles] = useState([<TabPanel><CodeEditor/></TabPanel>])

    const hanldleAdd = (e:any) =>{
        let newTab = tabs
        newTab.push(<Tab>New Tab <button className="Button" onClick={hanldleClose}>×</button></Tab>)
        setTabs(newTab)

        let newPanel = panels
        newPanel.push(<TabPanel><CodeEditor/></TabPanel>)
        setPanles(newPanel)
    }

    function hanldleClose(e:any){
        if(typeof(e) === 'object'){
            setBan(true)
        } 
        else if(typeof(e) === 'number' && ban){
            let newTab = tabs
            newTab.splice(e, 1)
            setTabs(newTab)

            let newPanel = panels
            newPanel.splice(e, 1)
            setPanles(newPanel)

            setBan(false)
        }
    }

    return (
        <div>
            {console.log('render')}
            <Tabs onSelect={index => hanldleClose(index)} className="Tabbar">
                <TabList>
                    {tabs}
                    <button className="Button" onClick={hanldleAdd}>+</button>
                </TabList>
                    {panels}
            </Tabs>
        </div>
    )
}

export default TabBar