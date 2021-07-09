import "../App.css";
import { useRef } from "react";
import { TextField } from "@material-ui/core";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
    setValue: React.Dispatch<React.SetStateAction<string>>;
    label?:string;
    error?:string;
    type?:string;
    regex?:RegExp;
}
type MyInput = Props & React.HTMLProps<HTMLInputElement>


const VerificationInput = ({setValue, label,error, type,regex}:MyInput) =>{
    const textRef = useRef<HTMLInputElement>(null);
    return (
      <>
        <TextField
        fullWidth
        inputRef={textRef} 
        type={type||"text"}
        error={regex && textRef.current && textRef.current.value && !regex.test(textRef.current.value) || false}
        helperText={regex && textRef.current && textRef.current.value && !regex.test(textRef.current.value) && error || false}
        required 
        label={label || ""}
        variant="outlined"
        onChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => setValue(e.target.value as string)} />
    </>
  );
}

export default VerificationInput;
