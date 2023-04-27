import React, { useEffect, useState} from 'react'
import { getErrors } from '../Services'
import { Error } from './Error'
import useColumns from './Column'
import { useTable, useSortBy } from 'react-table'

import '../Table.css'

const Errors = () => {
    
    const [errors, setErrors] = useState<Error[]>([])

    const loadTokens = async () => {
        const res = await getErrors()
        setErrors(res.data)
    }
    
    useEffect(() => {
        loadTokens()
    }, [])

    const columns = useColumns()
    const data = errors

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
      } = useTable<Error>({ columns, data }, useSortBy);

    return (
    <div className="app-containe">
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => {
                    return(
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column =>{
                            return(
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className={
                                        column.isSorted
                                        ? column.isSortedDesc
                                        ? "desc"
                                        : "asc"
                                        : ""
                                    }>
                                    {column.render("Header")}
                                </th>
                            )
                        })}
                    </tr>
                )})}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    return(
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell =>{
                                return(
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                )
                            })}
                        </tr>   
                    )})}                
            </tbody>
        </table>
    </div>
    )
}

export default Errors
