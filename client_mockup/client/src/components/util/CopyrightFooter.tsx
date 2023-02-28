import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
            {'Copyright © '}
            <Link color="inherit" href="">
                TwitterClone
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}