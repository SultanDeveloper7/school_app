import { Box } from "@mui/material";

interface FormBodyProps {
    children?: React.ReactNode;
    title?: string | undefined;
}

export default function FormBody(props: FormBodyProps) {
    const { children, title } = props;
    return <Box className="flex h-screen w-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
        <form className="flex w-96 flex-col items-center justify-center gap-4 rounded-lg bg-white p-8 shadow-lg">
            {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
            {children}
        </form>
    </Box>
}