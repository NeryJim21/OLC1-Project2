import React from 'react'
import Editor from '@monaco-editor/react'

const Home = () => {
    return(
        <div>
            <h1>Esta es la página principal mi pana</h1>
            <Editor
                height = '800px'
                width = '100vw'
                theme = 'vs-dark'
            />
            <button type="button" className="btn btn-success btn-lg">Ejecutar</button>
            <button type="button" className="btn btn-warning btn-lg">Limpiar</button>
        </div>
    )
}

export default Home