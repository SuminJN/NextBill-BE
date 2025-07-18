import { Box, Typography, Link, IconButton, useTheme } from '@mui/material';
import {
  Email as EmailIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      component="footer"
      sx={{
        mt: 3,
        py: 1,
        borderTop: isDarkMode 
          ? '1px solid rgba(51, 65, 85, 0.6)' 
          : '1px solid rgba(0, 0, 0, 0.06)',
        backgroundColor: isDarkMode 
          ? 'rgba(15, 23, 42, 0.8)' 
          : 'rgba(248, 250, 252, 0.8)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}
        >
          © {currentYear} NextBill. All rights reserved.
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            component={Link}
            href="https://github.com/suminjn/NextBill"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: isDarkMode ? '#818cf8' : '#6366f1',
                backgroundColor: isDarkMode 
                  ? 'rgba(129, 140, 248, 0.08)' 
                  : 'rgba(99, 102, 241, 0.08)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <GitHubIcon fontSize="small" />
          </IconButton>
          
          <IconButton
            component={Link}
            href="mailto:nextbill.kr@gmail.com"
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: isDarkMode ? '#818cf8' : '#6366f1',
                backgroundColor: isDarkMode 
                  ? 'rgba(129, 140, 248, 0.08)' 
                  : 'rgba(99, 102, 241, 0.08)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <EmailIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
