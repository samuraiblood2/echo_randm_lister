# Simple Web Utilities Collection

This project is a collection of client-side web-based utility tools, implemented using HTML, CSS, and vanilla JavaScript. Each tool is designed for a specific simple task and can be run directly in any modern web browser.

## Available Tools

Below is a list of the tools available in this collection:

### 1. Random Lister
-   **Description**: Randomly selects items from a user-provided list. After a specified number of random selections, it displays the count for each item and highlights the item that was selected most frequently.
-   **Usage**:
    1.  Navigate to `random_list.html`.
    2.  Enter the items you want to choose from into the text area, with each item on a new line.
    3.  In the "Amount" field, enter the total number of random selections you want to perform.
    4.  Click the "Submit" button to see the results.

### 2. Random Number Generator
-   **Description**: Generates a specified quantity of random numbers within a user-defined range (inclusive).
-   **Usage**:
    1.  Navigate to `random_number.html`.
    2.  In the "Range" fields, enter the minimum ("From") and maximum ("To") values for the random number generation.
    3.  In the "Amount" field, enter how many random numbers you want to generate.
    4.  Click the "Submit" button. The generated numbers will be displayed below.

### 3. Coin Flipper
-   **Description**: Simulates a coin flip, displaying "Heads" or "Tails". It also keeps a running count of the total number of flips performed during the session.
-   **Usage**:
    1.  Navigate to `coin_flipper.html`.
    2.  Click the "Flip Coin" button.
    3.  The result ("Heads" or "Tails") and the updated flip count will be displayed.

### 4. Tarkov Roulette
-   **Description**: A helper tool for the game Escape from Tarkov. It helps players decide whether to play as a "Scav" or "PMC". If "Random" is chosen, it will pick between Scav and PMC. After the player type is determined, it allows the user to select from a list of game locations (maps) and optionally include "Night" as a time variant, then randomly picks a location.
-   **Usage**:
    1.  Navigate to `tarkov_roulette.html`.
    2.  Click "Scav", "PMC", or "Random" to determine the player type.
    3.  Once the player type is shown, a list of locations will appear as checkboxes. Select the locations you are willing to play.
    4.  Optionally, check the "Allow night?" box if you are willing to play night raids.
    5.  Click the "Choose" button to get a randomly selected location and time (if night was allowed and selected).

## Technology Stack

-   **HTML**: For the structure and content of the web pages.
-   **CSS**: For styling the appearance of the pages and making them visually appealing.
-   **JavaScript**: For implementing the logic and interactivity of each tool. All tools run entirely on the client-side.

## How to Run

To use any of these tools:
1.  Clone or download this repository to your local machine.
2.  Navigate to the project directory.
3.  Open any of the `.html` files (e.g., `index.html`, `random_list.html`, etc.) directly in your preferred web browser.
    -   `index.html` serves as a home page with navigation to all other tools.

No special build process or server is required as these are simple client-side applications.
