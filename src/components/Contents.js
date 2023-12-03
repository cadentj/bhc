import React from 'react';
import Typography from '@mui/material/Typography';
import StyledAccordion from './StyledAccordion';
import { Paper, Box } from '@mui/material';

export default function Contents({ title, description, resources, barriers, color }) {
    return (
        <>
            <Typography variant='h3'>{title}</Typography>
            <p>
                {description}
            </p>
            {resources !== "None" &&
                <div>
                    {resources.map((link, index) => (
                        <a key={index} href={link}>Link {index}</a>
                    ))}
                </div>
            }
            {barriers !== "None" &&
                <Box sx={{
                    border: 3,
                    borderColor: color,
                    borderRadius: 5,
                    paddingX: 3,
                    paddingY: 2,
                }}>
                    {barriers}
                </Box>
            }

        </>
    )
}
