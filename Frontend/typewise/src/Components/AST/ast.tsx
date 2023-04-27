import React, { useState, useEffect } from 'react'
import { Graphviz } from 'graphviz-react'
import { getDot } from './Services'

const AST = () => {
    const [ast, setDot] = useState<string>('diagraph g { }')

    const loadDot = async () => {
        const res = await getDot()
        setDot(res.data)
    }

    useEffect(() => {
        loadDot()
    }, [])

    return (
        <div>
            <Graphviz
            options={{
                fit: true,
                height: 1000,
                width: 2130,
                zoom: true
            }}
            dot={ast} />
        </div>
    )
}

export default AST