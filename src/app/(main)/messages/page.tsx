import { Chat } from "@/app/(main)/messages/chat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Messages() {
  return <Chat />;
}
