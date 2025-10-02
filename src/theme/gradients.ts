/**
 * Gradient Color Palette
 * Consistent gradient colors for cards and UI elements
 */

export const gradients = {
  // Primary gradients - for main statistics
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',

  // Soft gradients - for secondary cards
  softBlue: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  softPurple: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
  softPink: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  softOrange: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',

  // Vibrant gradients - for highlights
  vibrantPurple: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  vibrantGreen: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  vibrantPink: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  vibrantOrange: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',

  // Special gradients
  sunset: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
  ocean: 'linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)',
  forest: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
  twilight: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  aurora: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',

  // Sidebar gradient
  sidebar: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  sidebarHover: 'linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',

  // Header gradient
  header: 'linear-gradient(90deg, #ffffff 0%, #f8f9fa 100%)',
  headerDark: 'linear-gradient(90deg, #1f1f1f 0%, #2a2a2a 100%)',
} as const;

export const cardColors = {
  // Text colors for gradient cards
  light: '#333333',
  dark: '#ffffff',
  lightSecondary: '#555555',
  darkSecondary: 'rgba(255,255,255,0.9)',
} as const;

/**
 * Get appropriate text color based on gradient
 * @param gradient - The gradient name
 * @returns Text color (light or dark)
 */
export const getTextColor = (gradient: keyof typeof gradients): string => {
  const darkBackgrounds = ['primary', 'secondary', 'sunset', 'ocean', 'aurora'];
  return darkBackgrounds.includes(gradient) ? cardColors.dark : cardColors.light;
};
