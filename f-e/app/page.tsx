import Image from "next/image";

export default function Home() {
  return (
    <div>
      <header role="banner">
        <h1>Main Heading</h1>
        <p>Welcome description</p>
        <button>Chat</button>
        <img src="hero-image.jpg" alt="Hero" />
      </header>
      <section role="region" aria-label="Features">
        <h2>Features</h2>
        <ul>
          <li>Feature 1</li>
        </ul>
      </section>
      <section role="region" aria-label="About">
        <p>About this software</p>
        <a href="#">Link</a>
      </section>
    </div>
  );
}
