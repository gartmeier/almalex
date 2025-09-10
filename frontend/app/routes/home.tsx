import { MessageInput } from "~/components/message-input";

export default function Component() {
  function handleSubmit() {}

  return (
    <div className="fixed right-0 bottom-0 left-0 z-10 p-4">
      <div className="mx-auto max-w-3xl">
        <MessageInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
