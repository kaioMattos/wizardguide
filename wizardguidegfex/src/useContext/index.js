import React, { createContext, useState, useContext } from 'react';

export const WzdGdContext = createContext();


export const WzdGdContextProvider = (props) => {
    const [supplier, setSupplier] = useState({
        documentId:'',
        cnpj: [],
        manufacturer: [],
        _class: [],
        exclusivityLetter: [],
        activeNextDisabled: true,
        validatedPetro:'',        
    })

    const setActiveForm = (sValue)=>{
        setSupplier({...supplier, validatedPetro:sValue})
    }

    const setSupplierContext = (supplier)=>{
        setSupplier(supplier)
    }
    const setExpiredDate = (item, action)=>{
        const remapEL = supplier.exclusivityLetter.map((document)=>{
            if(document.id === item.id){
                return item
            }
            return document
        })
        setSupplier({ ...supplier, exclusivityLetter: remapEL,activeNextDisabled: action })
    }
    const setActiveNext = (action) => {
        setSupplier({ ...supplier, activeNextDisabled: action })
    }
    
    const setExclusivityLetter = (aExclusivityLetter) => {
        const bActiveNext = !aExclusivityLetter.filter((item)=>(item.status && item.expiredDateTime !== '')).length ? true : false;
        setSupplier({ ...supplier, exclusivityLetter: aExclusivityLetter, activeNextDisabled: bActiveNext })
    }

    const setClass = (aClass) => {
        const bActiveNext = !aClass.filter((item)=>(item.status)).length ? true : false;
        setSupplier({ ...supplier, _class: aClass, activeNextDisabled: bActiveNext })
    }
    const setManufClass = (aClass) => {
        const bActiveNext = !supplier.manufacturer.filter((item)=>(item.status)).length ? true : false;
        setSupplier({ ...supplier, _class: aClass,activeNextDisabled: bActiveNext })
    }
    const setAssembleInitDataPerCnpj = (aCnpj,aManufacturer,aClass) => {
        const bActiveNext = !aCnpj.length ? true : false;
        setSupplier({ 
            ...supplier,
            cnpj: aCnpj,
            manufacturer: aManufacturer,
            _class:aClass,
            activeNextDisabled: bActiveNext
        });
    }
    const setCnpj = (aCnpj) => {
        const bActiveNext = !aCnpj.length ? true : false;
        setSupplier({ ...supplier, cnpj: aCnpj, activeNextDisabled: bActiveNext });
    }
    const setManufacturer = (aManufacturer) => {
        const bActiveNext = !aManufacturer.filter((item)=>(item.status)).length ? true : false;
        setSupplier({ ...supplier, manufacturer: aManufacturer, activeNextDisabled: bActiveNext })
    }
    
    return <WzdGdContext.Provider value={{
        supplier, setCnpj, setManufacturer,
        setClass, setExclusivityLetter, setActiveNext, setAssembleInitDataPerCnpj, setManufClass,
        setExpiredDate, setSupplierContext, setActiveForm
    }}>
        {props.children}
    </WzdGdContext.Provider>
}

export const useWzdGd = () => useContext(WzdGdContext);
