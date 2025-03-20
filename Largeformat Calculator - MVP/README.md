# Large Format Calculator

A web-based calculator for large format printing costs, featuring real-time calculations and a user-friendly interface.

## Features

- Real-time calculation of printing costs based on dimensions
- Support for multiple materials with predefined rates
- Customizable base rates
- Two calculation modes (primary and alternative rates)
- Add-on support for both per-square-foot and per-piece items
- Detailed cost breakdown
- Mobile-friendly responsive design

## Project Structure

```
.
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Styles and responsive design
├── js/
│   ├── config.js       # Configuration for materials and add-ons
│   ├── calculator.js   # Core calculation logic
│   └── ui.js          # UI handling and event management
└── README.md          # Project documentation
```

## Usage

1. Open `index.html` in a web browser
2. Enter the dimensions (length and width)
3. Select a material from the dropdown
4. Modify the base rate if needed
5. Add optional add-ons
6. View the calculated results in real-time

## Configuration

Materials and add-ons can be configured in `js/config.js`:

```javascript
const CONFIG = {
  materials: [
    {
      id: "material-id",
      name: "Material Name",
      baseRate: 0,
    },
  ],
  addons: {
    perSquareFoot: [
      {
        id: "addon-id",
        name: "Add-on Name",
        rate: 0,
      },
    ],
    perPiece: [
      {
        id: "addon-id",
        name: "Add-on Name",
        rate: 0,
      },
    ],
  },
};
```

## Development

The project is built using vanilla JavaScript with a focus on modularity and maintainability. The code is organized into three main components:

1. **Calculator Logic** (`calculator.js`): Handles all calculations and maintains the state of the calculator.
2. **UI Handler** (`ui.js`): Manages user interactions and updates the display.
3. **Configuration** (`config.js`): Stores all configurable data like materials and add-ons.

## Browser Compatibility

The calculator is compatible with modern web browsers including:

- Chrome
- Firefox
- Safari
- Edge
