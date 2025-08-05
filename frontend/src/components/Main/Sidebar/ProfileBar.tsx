import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import React from 'react'

const ProfileBar = () => {
    return (
        <div className="flex w-full items-center justify-between bg-white rounded-xl p-4">
            <Image src={"/profile.png"} alt='User Avatar'
                className="border rounded-full hover:cursor-pointer hover:bg-grey-200 overflow-hidden text-sm" width={36} height={36} />
            <p className="text-sm font-bold">{"Người dùng"}</p>
            <Icon icon={"tabler:dots"} />
        </div >
    )
}

export default ProfileBar