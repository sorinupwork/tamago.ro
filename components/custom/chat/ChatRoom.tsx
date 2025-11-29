import ChatMessage from './ChatMessage';

type Message = {
  text: string;
  isUser: boolean;
};

type ChatRoomProps = {
  messages: Message[];
};

export default function ChatRoom({ messages }: ChatRoomProps) {
  return (
    <div className='flex-1 p-4 overflow-y-auto space-y-3'>
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg} />
      ))}
    </div>
  );
}
