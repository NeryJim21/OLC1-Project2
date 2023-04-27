import React, { useEffect, useState, useMemo} from 'react'
import { getTokens } from '../Services'
import { Token } from './Token'
import getColumns from './Column'
import { useTable, useSortBy } from 'react-table'

import '../Table.css'

const Tokens = () => {


    const [tokens, setTokens] = useState<Token[]>([])

    
    const loadTokens = async () => {
        const res = await getTokens()
        setTokens(res.data)
    }

    const columns = useMemo(() => getColumns(), [])
    const data = tokens

    useEffect(() => {
        loadTokens()
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
      } = useTable<Token>({ columns, data }, useSortBy);

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
                    )
                })}                
            </tbody>
        </table>
    </div>
    )
}

export default Tokens
