export const getLocalStoreData =(name:string)=>{
        return JSON.parse(localStorage.getItem(name) as string);
    
}

export const setLocalStoreData = (name: string, obj:any) => {
    return(localStorage.setItem(name, JSON.stringify(obj)));
};


