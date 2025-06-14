import { createContext } from 'react';

export interface Message {
    msgId: string | null;
    role: string | null;
    content: string | null;
    timestamp: string | null;
    convId?: string;
    convName?: string;
}

export interface ConversationData {
    convId: string | null;
    convName: string | null;
    date: string | null;
    msgList: Message[] | null;
}

export interface ConversationContextType {
    ConversationData: ConversationData | null;
    setConversationData: React.Dispatch<React.SetStateAction<ConversationData | null>>;
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


export const ConversationContext = createContext<ConversationContextType | undefined>(undefined);