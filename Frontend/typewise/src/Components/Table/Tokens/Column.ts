//import { useMemo } from 'react'
import { Column } from 'react-table'
import { Token } from './Token'

export default function getColumns() {
    const columns:Column<Token>[] = [
        {
            Header: 'ID',
            accessor:'id'
        },
        {
            Header: 'Tipo',
            accessor:'type'
        },
        {
            Header: 'Tipo',
            accessor:'type2'
        },
        {
            Header: 'Entorno',
            accessor:'environment'
        },
        {
            Header: 'Línea',
            accessor:'line'
        },
        {
            Header: 'Columna',
            accessor:'column'
        }]
    return columns
}