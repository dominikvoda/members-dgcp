import React from 'react';
import { Box, Typography } from '@mui/material';

type TagSize = 'tiny' | 'small' | 'medium' | 'large' | 'hero';

interface TagBadgeProps {
  number: number | null;
  size?: TagSize;
  highlight?: boolean;
  badgeColor?: string;
  highlightColor?: string;
}

const sizeConfig: Record<TagSize, { size: number; fontSize: string; hashSize: string; borderRadius: number }> = {
  tiny: { size: 28, fontSize: '0.7rem', hashSize: '0.4rem', borderRadius: 8 },
  small: { size: 36, fontSize: '0.85rem', hashSize: '0.5rem', borderRadius: 10 },
  medium: { size: 52, fontSize: '1.25rem', hashSize: '0.65rem', borderRadius: 14 },
  large: { size: 80, fontSize: '1.75rem', hashSize: '0.8rem', borderRadius: 18 },
  hero: { size: 140, fontSize: '3rem', hashSize: '1rem', borderRadius: 28 },
};

function darken(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const DEFAULT_COLOR = '#1565c0';
const DEFAULT_HIGHLIGHT = '#0d47a1';

const TagBadge: React.FC<TagBadgeProps> = ({
  number,
  size = 'medium',
  highlight = false,
  badgeColor = DEFAULT_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT,
}) => {
  const config = sizeConfig[size];

  if (number === null) {
    return (
      <Box
        sx={{
          width: config.size,
          height: config.size,
          transform: 'rotate(45deg)',
          borderRadius: `${config.borderRadius}px`,
          bgcolor: 'grey.300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            transform: 'rotate(-45deg)',
            color: 'grey.500',
            fontSize: config.fontSize,
            fontWeight: 'bold',
          }}
        >
          -
        </Typography>
      </Box>
    );
  }

  const baseColor = highlight ? highlightColor : badgeColor;
  const gradientDark = darken(baseColor, 30);

  return (
    <Box
      sx={{
        width: config.size,
        height: config.size,
        transform: 'rotate(45deg)',
        borderRadius: `${config.borderRadius}px`,
        background: `linear-gradient(145deg, ${baseColor}, ${gradientDark})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative',
        boxShadow: highlight
          ? `0 4px 12px ${baseColor}66`
          : '0 4px 12px rgba(0, 0, 0, 0.35)',
        flexShrink: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 3,
          left: 3,
          right: 3,
          bottom: 3,
          borderRadius: `${config.borderRadius - 4}px`,
          border: '1px solid rgba(255,255,255,0.15)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          transform: 'rotate(-45deg)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'center',
        }}
      >
        {size !== 'tiny' && (
          <Typography
            sx={{
              fontSize: config.hashSize,
              fontWeight: 600,
              lineHeight: 1,
              opacity: 0.5,
              mr: '1px',
            }}
          >
            #
          </Typography>
        )}
        <Typography
          sx={{
            fontSize: config.fontSize,
            fontWeight: 'bold',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {number}
        </Typography>
      </Box>
    </Box>
  );
};

export default TagBadge;
