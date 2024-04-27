type ButtonProps = {
    text: string,
    handleClick: () => void;
    className: string;
    type: "submit" | "reset" | "button" | undefined
}


export const DefaultButton = ({ text, type, handleClick, className }: ButtonProps) => {
    return (
        <>
            <input className={`${className} cursor-pointer`} type={type} onClick={handleClick} value={text}/>

        </>
    )
}