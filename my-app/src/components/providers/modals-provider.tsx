'use client'

import { useEffect, useState } from "react"
import { InitialModals } from "../modals"

export function ModalProvider(){
    const [isMounted , setIsMounted] = useState(false)
    useEffect(() =>{
        setIsMounted(true)
    },[])
    if (!isMounted) return null;
    return(
        <InitialModals/>
    )
}