
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
        wine: {
          50: '#fcf2f6',
          100: '#fae6ed',
          200: '#f5ceda',
          300: '#eba5bc',
          400: '#e07a9a',
          500: '#d25379',
          600: '#B03054', // dark theme primary
          700: '#8E2140', // light theme primary 
          800: '#7a1d3a',
          900: '#651b35',
          950: '#400a1c',
        },
        teal: {
          50: '#effefa',
          100: '#c7fff3',
          200: '#90ffea',
          300: '#62f5e4',
          400: '#2ce2d1',
          500: '#18c6b6',
          600: '#0d9e96',
          700: '#107d78',
          800: '#116261',
          900: '#135251',
          950: '#043434',
        },
        gold: {
          50: '#fbf8eb',
          100: '#f6eec7',
          200: '#eeda8b',
          300: '#e6c054',
          400: '#dfa52f',
          500: '#cb871d',
          600: '#a86617',
          700: '#844817',
          800: '#6f3a19',
          900: '#5f301b',
          950: '#361a0c',
        },
        lavender: {
          50: '#f6f4ff',
          100: '#eeeaff',
          200: '#dcd5ff',
          300: '#c2b3ff',
          400: '#a285fd',
          500: '#8654f9',
          600: '#7739ef',
          700: '#6727db',
          800: '#5720b6',
          900: '#481b94',
          950: '#2b0f64',
        },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
        shimmer: {
          '0%': { backgroundPosition: '-40rem 0' },
          '100%': { backgroundPosition: '40rem 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wave: {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(14.0deg)' },
          '20%': { transform: 'rotate(-8.0deg)' },
          '30%': { transform: 'rotate(14.0deg)' },
          '40%': { transform: 'rotate(-4.0deg)' },
          '50%': { transform: 'rotate(10.0deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'blink': 'blink 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'wave': 'wave 2s linear infinite',
			},
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-wine': 'linear-gradient(135deg, #8E2140 0%, #B03054 100%)',
        'gradient-wine-gold': 'linear-gradient(135deg, #8E2140 0%, #e6c054 100%)',
        'gradient-wine-teal': 'linear-gradient(135deg, #8E2140 0%, #2ce2d1 100%)',
        'gradient-wine-lavender': 'linear-gradient(135deg, #8E2140 0%, #c2b3ff 100%)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            code: {
              backgroundColor: 'hsl(var(--muted))',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'hsl(var(--muted))',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
            },
          },
        },
      },
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
