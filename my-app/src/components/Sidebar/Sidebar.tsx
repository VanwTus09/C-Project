"use client";
export default function Sidebar() {
  return (
    <div className="h-screen bg-white border-r p-4 space-y-4 text-lg  ">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-2">💬 Tên Server</h2>
        <h3>Search conversation and Participants</h3>
      </div>
      <div className="space-y-2">Text Conversation </div>
      <div>Voice</div>
      <div>Call Video</div>
      <div>Participants</div>
    </div>
  );
}
