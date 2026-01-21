# HOMIE Coffee - Scrollytelling Landing Page

A high-end, scrolling narrative experience for HOMIE Coffee, featuring a seamless coffee lifecycle animation.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Rendering**: HTML5 Canvas (60fps optimized)

## Getting Started

Since this project was generated in an environment without Node.js access, you will need to install the dependencies manually.

1. **Install Node.js**: Ensure you have Node.js (v18+) installed.
2. **Navigate to the project**:

    ```bash
    cd homie-coffee
    ```

3. **Install Dependencies**:

    ```bash
    npm install
    ```

4. **Run the Development Server**:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: React components, including the core `CoffeeScroll.tsx`.
- `public/frames/`: The sequence of 128 animation frames.
- `styles/`: Global styles and Tailwind configuration.

## Features

- **Sticky Canvas**: The animation remains centered while you scroll through the narrative.
- **Scroll-Linked Animation**: 128 frames of coffee evolution synced perfectly to scroll position.
- **Preloader**: A custom loading screens ensures all assets are ready before the experience begins.
- **Responsive**: Adapts to different screen sizes while maintaining the focus on the product.

## Customization

To change the animation speed or length, adjust the `h-[600vh]` class in `components/CoffeeScroll.tsx`.
To add more frames, place them in `public/frames/` and update `FRAME_COUNT` in `components/CoffeeScroll.tsx`.
