import { Input } from "@/components/ui/input";

export default function Chat() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Chat with Us
        </h1>
        <Input
          type="text"
          placeholder="Type your message..."
          className="w-80"
        />
      </div>
    </div>
  );
}