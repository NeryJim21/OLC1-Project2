import React, { useState } from 'react'
import { Codemirror } from 'react-codemirror-ts'
import { download } from './Download'
import { getOutput } from './Servises'

import 'codemirror/mode/clike/clike.js'
import 'codemirror/theme/monokai.css'  
import 'codemirror/theme/liquibyte.css'
import 'codemirror/lib/codemirror.css'
import './Editor.css'

const CodeEditor = () => {
    const [code, setCode] = useState<string>("")
    const [output, setOutput] = useState<string>("")
    const [fileName, setFielName] = useState<string>("Typewise.tw")

    const sendCode = async () => {
        const res = await getOutput(code)
        setOutput(res.data.toString())
    }

    const handleClick = () => {
        setOutput("")
        sendCode()
    }

    const handleFile = (e:any) => {
        let files = e.target.files
        setFielName(files[0].name)
        let reader = new FileReader()
        reader.onload = (i:any) => {
            const text = i.target.result
            setCode(text)
        }
        reader.readAsText(files[0])
    }

    const handleSave = () => {
        download(fileName, code)
    }

    return (
        <div>
            <div className="Bar">
                <ul className="Bar-Items">
                    <li>
                        <button className="Run" onClick={handleClick}>Run</button>
                    </li>
                    <li>
                        <button className="Save" onClick={handleSave}>Save</button>
                    </li>
                    <li>
                        <input className="Open" id="id" type="file" multiple={false} 
                        accept=".tw" onChange={e => handleFile(e)} />
                    </li>
                </ul>
            </div>

            <div className="container-code">
                <Codemirror
                    value={code}
                    name="example"
                    options={{
                        lineNumbers: true,
                        lineWrapping: true,
                        matchBrackets: true,
                        mode: "text/x-java",
                        theme: 'liquibyte',
                        tabSize: 4,
                    }}
                    onChange={(value, options) => {
                        setCode(value);
                    }}
                    />
            </div>

            <div className="container-console">
                <Codemirror
                    className="code-mirror-wrapper"
                    value={output}
                    options={{
                        theme: 'monokai',
                        readOnly: 'nocursor',
                        mode: null,
                    }}
                    />
            </div>
        </div>
    )
}

export default CodeEditor