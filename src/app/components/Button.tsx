import { MdOutlineEdit } from "react-icons/md";
type ButtonProps = {
  text: string;
  handleClick: () => void;
  className: string;
  type: "submit" | "reset" | "button" | undefined;
  icon?: any;
  form?: any;
};

export const DefaultButton = ({
  text,
  type,
  handleClick,
  className, form
}: ButtonProps) => {
  return (
    <>
      <input
        className={`${className} cursor-pointer`}
        type={type}
        onClick={handleClick}
        value={text}
        form={form}
      />
    </>
  );
};

export const EditButton = ({
  text,
  type,
  handleClick,
  className,
}: ButtonProps) => {
  return (
    <div className={`${className}`}>
      <MdOutlineEdit />
      <input
        className={`cursor-pointer`}
        type={type}
        onClick={handleClick}
        value={text}
      />
    </div>
  );
};
