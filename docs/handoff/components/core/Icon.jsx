import React from 'react';

// Ícones Lucide (ISC) copiados de assets/icons — traço 1.75, cantos arredondados, sempre currentColor.
const PATHS = {
 "scissors": "<circle cx=\"6\" cy=\"6\" r=\"3\"></circle> <path d=\"M8.12 8.12 12 12\"></path> <path d=\"M20 4 8.12 15.88\"></path> <circle cx=\"6\" cy=\"18\" r=\"3\"></circle> <path d=\"M14.8 14.8 20 20\"></path> ",
 "map-pin": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"></path> <circle cx=\"12\" cy=\"10\" r=\"3\"></circle> ",
 "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle> <path d=\"M12 6v6l4 2\"></path> ",
 "arrow-right": "<path d=\"M5 12h14\"></path> <path d=\"m12 5 7 7-7 7\"></path> ",
 "arrow-down": "<path d=\"M12 5v14\"></path> <path d=\"m19 12-7 7-7-7\"></path> ",
 "message-circle": "<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\"></path> ",
 "phone": "<path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\"></path> ",
 "check": "<path d=\"M20 6 9 17l-5-5\"></path> ",
 "calendar": "<path d=\"M8 2v3\"></path> <path d=\"M16 2v3\"></path> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect> <path d=\"M3 9h18\"></path> ",
 "navigation": "<polygon points=\"3 11 22 2 13 21 11 13 3 11\"></polygon> ",
 "chevron-right": "<path d=\"m9 18 6-6-6-6\"></path> ",
 "menu": "<path d=\"M4 5h16\"></path> <path d=\"M4 12h16\"></path> <path d=\"M4 19h16\"></path> ",
 "x": "<path d=\"M18 6 6 18\"></path> <path d=\"m6 6 12 12\"></path> ",
 "star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"></path> ",
 "route": "<path d=\"M9 5h8.5a1 1 0 010 7h-11a1 1 0 000 7H15\"></path> <circle cx=\"18\" cy=\"19\" r=\"3\"></circle> <circle cx=\"6\" cy=\"5\" r=\"3\"></circle> "
};

export function Icon({ name, size = 20, strokeWidth = 1.75, title, style, ...rest }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}
      style={{ flex: 'none', ...style }} {...rest}
      dangerouslySetInnerHTML={{ __html: PATHS[name] || '' }}
    />
  );
}
