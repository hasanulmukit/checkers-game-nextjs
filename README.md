# aCheckers

**aCheckers** is a modern, interactive checkers game built with Next.js (using the App Router), Tailwind CSS, and React DnD. This project reimagines the classic board game with advanced gameplay features, an intuitive drag-and-drop interface, and a modern aesthetic.

## Features

- **Drag-and-Drop Functionality:** Move pieces by dragging them onto valid squares using React DnD.
- **Advanced Move Validation:** Enforces checkers rules including forced captures, multiple jumps, and king promotion.
- **Undo Move:** Step back through moves using the undo functionality.
- **Game Over Detection:** Automatically detects when one side runs out of pieces and displays a centered game over overlay with the winner.
- **Scrollable Move History:** View a log of all moves in a scrollable, elegantly styled panel.
- **Responsive UI:** The board and controls are optimized for a modern and accessible look.
- **Control Panel:** Positioned beside the board, featuring advanced styling for Restart, Undo, and Cancel Forced Move actions.

## Technologies Used

- **Next.js (App Router)**
- **React & JSX**
- **Tailwind CSS**
- **React DnD (HTML5 Backend)**
- **JavaScript**

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/acheckers.git
   ```

2. Navigate to the Project Directory:

   ```bash
   cd acheckers
   ```

3. Install Dependencies:

   ```bash
   npm install
   ```

4. Run the Development Server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser to play the game.

## Folder Structure

- checkers/
- ├── app/
- │ ├── layout.jsx # Root layout (server component) that imports global styles and wraps the app in client providers.
- │ └── page.jsx # Main page rendering the game board and control panel.
- ├── components/
- │ ├── Board.jsx # Game board component.
- │ ├── Square.jsx # Individual square component (drop target).
- │ ├── Piece.jsx # Draggable checkers piece component.
- │ ├── ClientProviders.jsx # Client-only wrapper for GameProvider and DndProvider.
- │ └── GameContext.jsx # Context API for game state management.
- ├── styles/
- │ └── globals.css # Global CSS file (includes Tailwind CSS directives).
- └── README.md

## Usage

- Moving Pieces: Drag a piece onto a valid dark square. If a capture is available, you must capture.
- Forced Capture: When a capture move is available, the game forces the move to comply with checkers rules.
- Undo Moves: Click the Undo Move button to revert to the previous state.
- Restart Game: Click the Restart Game button to reset the game.
- Cancel Forced Move: If a forced move is causing issues, use the Cancel Forced Move button.
- Move History: The scrollable panel on the right shows a log of all moves.
- Game Over: When one side has no pieces remaining, a centered overlay appears on a blurred board displaying the winner.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have ideas for improvements, bug fixes, or additional features.

### License

This project is licensed under the MIT License.
