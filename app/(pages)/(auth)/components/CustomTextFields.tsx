import { TextField } from "@mui/material";

interface CustomTextFieldProps {
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomTextField(props: CustomTextFieldProps) {
    const { label, type, name, value, onChange } = props;
    return <TextField
        label={label}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
    />
}