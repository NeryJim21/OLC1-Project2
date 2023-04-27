import { useMemo } from 'react'
import { Column } from 'react-table'
import { Error } from './Error'

export default function useColumns() {
    const columns:Column<Error>[] = useMemo( () =>
    [
        {
            Header: 'Tipo',
            accessor:'type'
        },
        {
            Header: 'Descripción',
            accessor:'description'
        },
        {
            Header: 'Línea',
            accessor:'line'
        },
        {
            Header: 'Columna',
            accessor:'column'
        }
    ],
    [])
    return columns
}