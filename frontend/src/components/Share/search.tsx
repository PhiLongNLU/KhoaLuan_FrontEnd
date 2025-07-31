import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

interface SearchProps {
    onClick: () => void
}

const Search = ({ onClick, ...props }: SearchProps) => {

    const iconSize = 30

    return (
        <div className='cursor-pointer' {...props} onClick={onClick} >
            <Icon icon={"lets-icons:search-alt"} width={iconSize} height={iconSize} />
        </div>
    )
}

export default Search