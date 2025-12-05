export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">About Secret Santa Family</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-muted-foreground">
          A modern web app to organize your family Secret Santa with ease.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Create family groups</li>
          <li>Add participants easily</li>
          <li>Random assignment with smart rules</li>
          <li>Automatic email notifications</li>
          <li>Avoid couples or previous year repetitions</li>
        </ul>
      </div>
    </div>
  );
}

