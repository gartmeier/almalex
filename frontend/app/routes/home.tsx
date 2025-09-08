import { MessageInput } from "~/components/message-input";

export default function Component() {
  function handleSubmit() {}

  return (
    <div>
      <div className="absolute bottom-4 w-full px-4">
        <div className="mx-auto max-w-3xl">
          <MessageInput onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
