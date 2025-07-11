import { EditableMessage } from "../editableMessage";

export function UserMessage({
    message,
    onEdit,
    token,
    historyTokens }: {
        message: string | null;
        onEdit: (newMessage: string | null) => void;
        token: number;
        historyTokens?: number;
    }) {
    return (
        <div className="self-end sm:mr-0 md:mr-15 mt-5">
            <EditableMessage
                message={message}
                onEdit={onEdit}
            />
            {token > 0 && (
                <div className="text-[10px] text-gray-500 italic text-right pr-2 mt-1">
                    {token} tokens {(historyTokens !== undefined) && (historyTokens > 0) ? ` | ${historyTokens} tokens from history context` : ''}
                </div>)
            }
        </div>
    );
}