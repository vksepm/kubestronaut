# Kubestronaut Knowledge Graph

The **Kubestronaut Knowledge Graph** is an interactive web tool that visualizes the relationships between topics covered in various Kubernetes certification courses. It helps learners and professionals understand topic overlaps, course coverage, and knowledge dependencies in the Kubernetes ecosystem.

---

## Features

- **Dynamic Course Cards:** Courses and their topics are loaded dynamically from a JSON data file.
- **Interactive Topic Highlighting:** Hovering or clicking on a topic highlights its presence across all courses.
- **Course Comparison:** Hovering or clicking on a course name shows shared topics and completion percentages with other courses.
- **Search Functionality:** Quickly filter topics across all courses.
- **Visual Connections:** SVG lines visually connect shared topics between courses.
- **Responsive Design:** Works well on both desktop and mobile (with a mobile warning for best experience).
- **Social Sharing:** Share the knowledge graph on LinkedIn, Twitter, and BlueSky.
- **User Guide:** Onboarding tutorial for first-time users.

---

## Project Structure

```
├── assets/                # SVG logos for courses and branding
│   ├── cka-logo.svg
│   ├── ckad-logo.svg
│   ├── cks-logo.svg
│   ├── kcna-logo.svg
│   ├── kcsa-logo.svg
│   └── kubestronaut-stacked-color.svg
├── data.json              # Main data source: courses, sections, topics
├── index.html             # Main HTML file
├── script.js              # Main JavaScript for dynamic rendering and interactivity
├── styles.css             # Custom CSS styles
├── userGuide.js           # User onboarding and tutorial logic
```

---

## Data Model

- **data.json** contains an array of courses.
  - Each course has a `name`, `description`, and `sections`.
  - Each section has a `name` and a list of `topics`.

Example:
```json
{
  "courses": [
    {
      "name": "CKA",
      "description": "...",
      "sections": [
        {
          "name": "Core Concepts",
          "topics": ["Kubernetes Architecture", ...]
        },
        ...
      ]
    },
    ...
  ]
}
```

---

## How It Works

### 1. Dynamic Rendering
- On page load, `script.js` fetches `data.json` and dynamically creates course cards and topic lists using a template in `index.html`.
- Topics are grouped by section and rendered inside each course card.

### 2. Interactivity
- **Topic Hover/Click:** Highlights all instances of the topic across courses and draws animated SVG connections.
- **Course Hover/Click:** Highlights topics shared with other courses and shows completion percentages.
- **Search:** Filters topics and redraws connections for visible topics only.
- **User Guide:** `userGuide.js` provides a step-by-step onboarding for new users.

### 3. Visual Connections
- SVG paths and circles are drawn between matching topics in different courses for visual mapping.
- Gradients and animations are used for better UX.

---

## Styling
- Uses [TailwindCSS](https://tailwindcss.com/) via CDN for utility-first styling.
- Custom styles in `styles.css` for layout, cards, connections, and responsive design.
- Font Awesome for icons.

---

## Social Sharing
- Share buttons for LinkedIn, Twitter, and BlueSky are available in the UI and onboarding toast.
- Share URLs are dynamically generated based on the current or production URL.

---

## Social Meta Tags (Open Graph & Twitter)
- Defined in the `<head>` of `index.html` to enable rich link previews on social platforms.
- **Open Graph Tags:**
  - `og:type`: Type of the site (e.g., `website`).
  - `og:url`: Canonical URL of the page.
  - `og:title`: Title for link previews.
  - `og:description`: Description for link previews.
  - `og:image`: Preview image URL.
- **Twitter Card Tags:**
  - `twitter:card`: Card type (e.g., `summary_large_image`).
  - `twitter:url`: URL of the page.
  - `twitter:title`: Title for Twitter preview.
  - `twitter:description`: Description for Twitter preview.
  - `twitter:image`: Image for Twitter preview.

---

## How to Run Locally

1. **Clone or Download** this repository.
2. **Open `index.html`** directly in your browser.
   - No build step or server is required for basic usage.
   - For full functionality (fetching `data.json`), you may need to serve the folder with a local web server (e.g., VS Code Live Server, Python's `http.server`, etc.) due to browser CORS restrictions.

   Example (Python 3):
   ```sh
   python -m http.server 8000
   # Then open http://localhost:8000 in your browser
   ```

---

## Dependencies

- [TailwindCSS CDN](https://cdn.tailwindcss.com)
- [Flowbite](https://flowbite.com/) (for some UI components)
- [Font Awesome](https://fontawesome.com/)

---

## Customization

- **Add/Edit Courses:** Update `data.json` with new courses, sections, or topics.
- **Change Logos:** Place new SVGs in the `assets/` folder and update logic in `script.js` if needed.
- **Styling:** Modify `styles.css` or override Tailwind classes in `index.html`.

---

## Credits

- Created by [KodeKloud](https://kodekloud.com) for the Kubernetes community.
- Logos and course names are property of their respective owners.

---

## License

This project is for educational and community use. See [KodeKloud](https://kodekloud.com) for more information.
