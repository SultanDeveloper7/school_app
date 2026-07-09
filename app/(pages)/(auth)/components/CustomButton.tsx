import { Button } from "@mui/material";

interface CustomButtonProps {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CustomButton(props: CustomButtonProps) {
    const { label, onClick } = props;
    return <Button variant="contained" type="submit" onClick={onClick}>
        {label}
    </Button>
}